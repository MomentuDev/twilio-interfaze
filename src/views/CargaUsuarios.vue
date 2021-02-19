<template>
  <v-container>
    <v-card height="100%" class="d-flex flex-row mb-12">
        <sidebar></sidebar>
      <v-card height="100%" class="d-flex flex-row mb-12">
        <v-container class="mx-auto">
          <v-slide-y-transition mode="out-in">
            <v-layout row>
              <v-flex sm12 class="mx-auto" pa-6>
                <h1 class="display-2 text-center black--text font-weight-thin mt-12 mb-8">
                  Usuarios Nuevos
                </h1>
              </v-flex>
              <v-flex sm9 class="mx-auto" pa-6>
                <v-card class="mx-auto ma-4">
                  <v-card-title>
                    Cargar formulario
                  </v-card-title>
                  <v-card-text>
                     <v-row>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                        <v-text-field
                          v-model="formId"
                          hint="Ingresa el Id del formulario"
                          label="Id Formulario"
                        ></v-text-field>
                        <v-text-field
                          v-model="empresa"
                          hint="Nombre empresa"
                          label="Empresa"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                        <v-btn
                          v-on:click="getUsers()"
                        >
                          Cargar formulario
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-card class="mx-auto ma-4">
                <v-card-title>
                  Registros
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-divider class="mt-w"></v-divider>
                  <v-row no-gutters>
                    <v-col class="pl-3" cols="12" sm="12">
                      <v-data-table
                        :headers="encabezadoTabla"
                        :items="users"
                        :search="search"
                        multi-sort
                        class="elevation-1">
                        <template v-slot:item.verPerfil="{ item }">
                          <v-btn
                            v-if="!item.fallida"
                            text
                            color="primary"
                            v-on:click="createUser(item)"
                          >
                            <v-icon small class="mr-2">
                              mdi-account-plus
                            </v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-layout>
          </v-slide-y-transition>
        </v-container>
      </v-card>
    </v-card>
  </v-container>
</template>


<script>
// @ is an alias to /src
const axios = require('axios');
const url = 'https://us-central1-utility-pad-293317.cloudfunctions.net/momentu';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'Home',
  components: {
    Sidebar,
  },
  data(){
    return {
      users: [],
      search: '',
      encabezadoTabla: [
        { text: 'Nombre', align: 'center', value: 'nombre' },
        { text: 'Correo', align: 'center', value: 'correo' },
        { text: 'Categoria', align: 'center', value: 'categoria' },
        { text: 'Indicativo', align: 'center', value: 'indicativo' },
        { text: 'Celular', align: 'center', value: 'celular_ajustado' },
        { text: 'Compañia', align: 'center', value: 'compania' },
        { text: 'Cargar', align: 'center', value: 'verPerfil' }     
      ],
      formId: '',
      empresa: '',
    };
  },
  methods: {
    getUsers() {
      axios.get(url+'/typeforms/'+this.formId)
        .then((res) => {
          let respuestas = res.data;
          respuestas.forEach(ans => {
            let user = {
              nombre: ans.answers[1].text,
              correo: ans.answers[4].email,
              categoria: ans.calculated.score/4 < 14 ? "Apoyo Terapéutico" : ans.calculated.score/4 > 17 ? "Bajo estrés" : "Estrés moderado-alto",
              indicativo: ans.answers[3].phone_number.substring(3,0),
              celular_original: ans.answers[3].phone_number.slice(3),
              celular_ajustado: ans.answers[3].phone_number.slice(3),
              pais: '',
              modulos: [],
              compania: this.empresa,
              test: true,
            };
            ans.answers [5].choices.labels.forEach(mod => {
              let modulo = {
                modulo: mod,
                capitulos: []
              };
              user.modulos.push(modulo);
            })
            this.users.push(user);
          });
        })
    },
    createUser(user) {
      axios.post(url+'/users', user)
      .then(res => {
        console.log(res);
      })
    }
  },
};
</script>
