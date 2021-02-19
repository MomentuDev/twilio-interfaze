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
                  Usuarios
                </h1>
              </v-flex>
              <v-card class="mx-auto ma-4">
                <v-card-title>
                  Usuarios
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
                            :to="{
                              name: 'user',
                              params: { id: item.id }
                            }"
                          >
                            <v-icon small class="mr-2">
                              mdi-eye
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
        { text: 'Pais', align: 'center', value: 'pais' },
        { text: 'Test', align: 'center', value: 'test' },
        { text: 'Compañia', align: 'center', value: 'compania' },
        { text: 'Ver Perfil', align: 'center', value: 'verPerfil' },
        { text: 'Mensajes', align: 'center', value: 'mensajesSinLeer'}        
      ],
    };
  },
  methods: {
    getUsers() {
      axios.get(url+'/users')
        .then((res) => {
          this.users = res.data.users;
          console.log(this.users);
        })
    }
  },
  mounted() {
    this.getUsers();
  },
};
</script>
