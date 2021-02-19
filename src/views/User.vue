<template>
  <v-container>
      <v-card outlined rounded class="mb-4">
      <hr class="px-16 primary">
      <v-card-title>Perfil Usuario</v-card-title>
      <v-container class="p-6 ml-7">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="ml-6 mt-3 mb-3">
              <span><v-icon class="mb-2 mr-3" color="light-blue darken-4">mdi-account</v-icon>
              <b class="font-weight-medium">Nombre: </b>
                {{user.nombre}}
              </span>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="ml-6 mt-3 mb-3">
              <span><v-icon class="mb-2 mr-3" color="light-blue darken-4">mdi-email</v-icon>
              <b class="font-weight-medium">Email: </b>{{user.correo}}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="ml-6 mt-3 mb-3" >
              <span><v-icon class="mb-1 mr-3" color="light-blue darken-4">
                mdi-account-box-outline</v-icon>
              <b class="font-weight-medium">Categoria:
                  </b> {{user.categoria}}</span>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="ml-6 mt-3 mb-3">
              <span>
                <v-icon class="mb-2 mr-3" color="light-blue darken-4">mdi-map-marker</v-icon>
              <b class="font-weight-medium">Pais: </b>{{user.pais}}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="ml-6 mt-3 mb-3">
              <span><v-icon class="mb-2 mr-3" color="light-blue darken-4">mdi-cellphone-iphone</v-icon>
              <b class="font-weight-medium"> Celular Original: </b> {{`${user.indicativo}${user.celular_original}`}}</span>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="ml-6 mt-3 mb-3">
              <span><v-icon class="mb-2 mr-3" color="light-blue darken-4">mdi-cellphone-iphone</v-icon>
              <b class="font-weight-medium">Celular Ajustado: </b>{{`${user.indicativo}${user.celular_ajustado}`}}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="4"
            v-for="(modulo, index) in user.modulos" :key="index"
          >
            <div class="ml-6 mt-3 mb-3">
              <span><v-icon class="mb-2 mr-3" color="light-blue darken-4">mdi-google-classroom</v-icon>
              <b class="font-weight-medium">Modulo {{index + 1}}: </b> {{modulo.modulo}}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-row justify="space-around">
      <v-card width="600">
       
          <v-app-bar color="dark-blue"            flat>
            <v-toolbar-title class="title black--text pl-0">
              Mensajes
            </v-toolbar-title>
          </v-app-bar>

        <v-card-text>
          <div class="font-weight-bold ml-8 mb-2">
            Today
          </div>

          <v-timeline
            align-top
            dense
          >
            <v-timeline-item
              v-for="message in messages"
              :key="message.time"
              :color="message.color"
              small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>{{ message.persona }}</strong> @{{ message.time.toString() }}
                </div>
                <div>{{ message.message }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
          <v-form @submit.prevent="sendAnswer">
            <v-text-field
              v-model="answer"
              label="Answer"
              required
            ></v-text-field>
             <v-btn
              color='blue'
              text
              type="submit"
            >
              Answer
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>  
</template>

<script>
// @ is an alias to /src
const axios = require('axios');
const url = 'https://us-central1-utility-pad-293317.cloudfunctions.net/momentu';
const from = '+5715800033';

export default {
  name: 'Home',
  components: {},
  props: ['id'],
  data(){
    return {
      user: {},
      messages: [],
      answer: '',
    };
  },
  methods: {
    getUsers() {
      axios.get(url+'/users/'+this.$route.params.id)
        .then((res) => {
          this.user = res.data.user;
          this.getMessages();
        })
    },
    getMessages() {
      axios.get(url+'/users/messages/'+this.user.indicativo+this.user.celular_ajustado)
        .then((res) => {
          this.messages = res.data.chat.chat;
          this.messages.forEach((msg) => {
            if(msg.type == 'sent'){
              msg.color = 'green';
              msg.persona = this.user.nombre;
            }
            else{
              msg.persona = 'Momentu';
            }
            msg.time = new Date(msg.time).toLocaleString();
          })
        })
    },
    sendAnswer() {
      if(!this.answer !== ''){
        let newAnswer = {
          message: this.answer,
          from: from,
          to: this.user.indicativo+this.user.celular_ajustado
        }
        axios.post(url+'/twilio/answermessage', newAnswer)
          .then((res) => {
            console.log(res);
            this.answer = '';
            this.getMessages();
          })
          .catch((err) => console.log(err));
      }
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>
