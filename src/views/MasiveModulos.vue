<template>
  <v-container>
    <v-card height="100%" class="d-flex flex-row mb-12">
      <sidebar></sidebar>
      <v-card outlined rounded class="mb-4" width="100%" height="100%">
        <v-card-title>
          Envío másivo módulos compañía:
        </v-card-title>
        <v-card-text>
          <strong>Mensajes envidados: </strong> {{messagesSent}}
          <v-form @submit.prevent="sendMessage">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-select
                    v-model="selected"
                    :items="selector"
                    label="Empresa/s"
                    multiple
                    chips
                    hint="Selecciona los destinatarios"
                    persistent-hint
                  ></v-select>
                </v-col>
              </v-row>
              <v-btn
                color='blue'
                text
                type="submit"
              >
                Send masive
              </v-btn>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
// @ is an alias to /src
const axios = require('axios');
const _ = require('lodash');
const url = 'https://us-central1-utility-pad-293317.cloudfunctions.net/momentu';
const from = '+5715800033';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'Home',
  components: {
    Sidebar
  },
  props: ['id'],
  data(){
    return {
      users: [],
      selector: [],
      companias: [],
      selected: [],
      templates: {
        OP: '',
        Modulo: '',
        Meditacion: '',
      },
      modulos: {},
      selectedTemp: {},
      date: '',
      time: '',
      messagesSent: 0,
    };
  },
  methods: {
    getUsers() {
      axios.get(url+'/users')
        .then((res) => {
          this.users = res.data.users;
          this.compania = _.groupBy(this.users, 'compania');
          this.selector = Object.keys(this.compania);
        })
    },
    getModulos() {
      axios.get(url+'/modulos/')
        .then((res) => {
          let mods = res.data;
          this.modulos = _.groupBy(mods.modulos, 'nombre');
        })
    },
    sendMessage() {
      if(this.selected.length > 0) {
        this.selected.forEach((sel) => {
          let users = this.compania[sel];
          users.forEach((user) => {
            let moduloOb = null;
            let capOb = 0;
            user.modulos.forEach((mod) => {
              let module = this.modulos[mod.modulo][0]
              if(module.capitulos.length > mod.capitulos.length && moduloOb === null) {
                moduloOb = module;
                capOb = mod.capitulos.length;
                mod.capitulos.push(module.capitulos[capOb].nombre);
              }
            })
            if(moduloOb.capitulos[capOb].nombre != ''){
              let newMessage = {
              message: this.templates[moduloOb.capitulos[capOb].categoria].replace('{{1}}', user.nombre.trim())
                .replace('{{2}}', user.compania.trim())
                .replace('{{3}}', moduloOb.capitulos[capOb].nombre)
                .replace('{{4}}', moduloOb.capitulos[capOb].url.trim()).toString(),
              from: from,
              to: user.indicativo+user.celular_ajustado
            }
            //console.log(newMessage)
            axios.post(`${url}/twilio/sendmessage`, newMessage)
              .then(() => {
                this.messagesSent++;
                this.updateUser(user);
              })
            }
          })                    
        })
      }
    },
    getTemplates() {
      axios.get(url+'/templates/')
        .then((res) => {
          let temps = res.data.templates;
          temps.forEach((template) => {
            let temp = template;
            this.templates = {
              OP: temp.category === 'OP' ? temp.template : this.templates.OP,
              Modulo: temp.category === 'Modulo' ? temp.template : this.templates.Modulo,
              Meditacion: temp.category === 'Meditacion' ? temp.template : this.templates.Meditacion
            }
          })
        })
    },
    updateUser(user) {
      axios.put(url+'/users/'+user.id, user);
    }
  },
  mounted() {
    this.getUsers();
    this.getTemplates();
    this.getModulos();
  },
};
</script>