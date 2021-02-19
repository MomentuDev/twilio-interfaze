<template>
  <v-container >
    <v-card height="100%" class="d-flex flex-row mb-12">
      <sidebar></sidebar>
      <v-card outlined rounded class="mb-4" width="100%" height="100%">
        <v-card-title>
          Envio masivo individual:
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
const url = 'https://us-central1-utility-pad-293317.cloudfunctions.net/momentu';
const from = '+5715800033';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'Home',
  components: {
    Sidebar,
  },
  props: ['id'],
  data(){
    return {
      users: [],
      selector: [],
      selected: [],
      templates: [],
      selectedTemp: {},
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
          this.users.forEach((user) => {
            let sel = `${user.nombre}, ${user.indicativo}${user.celular_ajustado}, ${user.compania}`
            this.selector.push(sel);
          })
        })
    },
    sendMessage() {
      if(this.selected.length > 0) {
        this.selected.forEach((sel) => {
          let newMessage = {
            message: this.selectedTemp.replace('{{1}}', sel.split(',')[0].trim()).replace('{{2}}', sel.compania).toString(),
            from: from,
            to: sel.split(',')[1].trim()
          }
          axios.post(`${url}/twilio/sendmessage`, newMessage)
            .then((res) => {
              this.messagesSent++;
              console.log(res);
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
  },
  mounted() {
    this.getUsers();
    this.getTemplates();
  },
};
</script>