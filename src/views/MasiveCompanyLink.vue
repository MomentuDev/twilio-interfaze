<template>
  <v-container>
    <v-card height="100%" class="d-flex flex-row mb-12">
      <sidebar></sidebar>
      <v-card outlined rounded class="mb-4" width="100%" height="100%">
        <v-card-title>
          Envío másivo con link compañía:
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
                    v-model="selectedTemp"
                    :items="templates"
                    label="Select"
                    chips
                    hint="Selecciona el mensaje"
                    persistent-hint
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-select
                    v-model="selected"
                    :items="selector"
                    label="Select"
                    multiple
                    chips
                    hint="Selecciona los destinatarios"
                    persistent-hint
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-text-field
                    v-model="descripcion"
                    label="Descripción"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-text-field
                    v-model="link"
                    label="Link - URL"
                    required
                  ></v-text-field>
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
      templates: [],
      selectedTemp: {},
      descripcion: '',
      link: '',
      date: "",
      time: "",
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
    sendMessage() {
      if(this.selected.length > 0) {
        this.selected.forEach((sel) => {
          let users = this.compania[sel];
          users.forEach((user) => {
            let newMessage = {
              message: this.selectedTemp.replace('{{1}}', user.nombre.trim())
                .replace('{{2}}', user.compania.trim())
                .replace('{{3}}', this.descripcion.trim())
                .replace('{{4}}', this.link.trim()),
              from: from,
              to: user.indicativo+user.celular_ajustado
            }
            console.log(newMessage)
            axios.post(`${url}/twilio/sendmessage`, newMessage)
              .then((res) => {
                this.messagesSent++;
                console.log(res);
                this.updateUser(user);
              })
          })                    
        })
      }
    },
    getTemplates() {
      axios.get(url+'/templates/Empresa')
        .then((res) => {
          let temps = res.data;
          temps.forEach((template) => {
            this.templates.push(template.template.template);
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
  },
};
</script>