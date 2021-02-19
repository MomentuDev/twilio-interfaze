<template>
  <v-container>
    <v-card height="100%" class="d-flex flex-row mb-12" extended>
        <sidebar></sidebar>
        <v-container class="mx-auto">
          <v-slide-y-transition mode="out-in">
            <v-layout row>
              <v-flex sm12 class="mx-auto" pa-6>
                <h1 class="display-2 text-center black--text font-weight-thin mt-12 mb-8">
                  Modulos
                </h1>
              </v-flex>
              <v-card class="mx-auto ma-4">
                <v-btn
                    fab
                    color="green accent-2"
                    bottom
                    left
                    absolute
                    @click="createModulo()"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                <v-card-title>
                  Modulos
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
                        :items="modulos"
                        :search="search"
                        multi-sort
                        class="elevation-1">
                        <template v-slot:item.actualizar="{ item }">
                          <v-btn
                            v-if="!item.fallida"
                            text
                            color="primary"
                            @click="editModulo(item)"
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
                <v-dialog
                  v-model="dialog"
                  max-width="500px"
                >
                  <v-card>
                    <v-card-text>
                      <v-card-title>
                        Gestión Modulos
                      </v-card-title>
                      <v-card-text>
                        <v-form
                          ref="form"
                          lazy-validation
                          @submit.prevent="moduleAction"
                        >
                          <v-text-field
                            v-model="currentModule.nombre"
                            label="Nombre"
                            required
                          ></v-text-field>

                          <v-text-field
                            v-model="currentModule.descripcion"
                            label="Descripción"
                            required
                          ></v-text-field>
                          <h3>Capitulos</h3>
                          <div v-for="(capitulo, index) in capitulos" v-bind:key="index">
                            <v-text-field v-model="capitulo.nombre" label="Nombre capitulo">
                            </v-text-field>
                            <v-text-field v-model="capitulo.url" label="URL capitulo">
                            </v-text-field>
                          </div>
                          <v-btn @click="addCapitulo">
                            Nuevo capitulo
                          </v-btn>

                          <div></div>
                          <v-btn
                            color="success"
                            class="mr-4"
                            @click="moduleAction"
                          >
                            Submit
                          </v-btn>

                          <v-btn
                            color="error"
                            class="mr-4"
                            @click="reset"
                          >
                            Reset Form
                          </v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-card>
            </v-layout>
          </v-slide-y-transition>
        </v-container>
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
  props: [],
  data(){
    return {
      modulos: [],
      search: '',
      encabezadoTabla: [
        { text: 'Nombre', align: 'center', value: 'nombre' },
        { text: 'Descripción', align: 'center', value: 'descripcion' },
        { text: 'Fecha', align: 'center', value: 'date' },
        { text: 'Actualizar', align: 'center', value: 'actualizar' }
      ],
      dialog: false,
      currentModule: {},
      updating: false,
      capitulos: []
    };
  },
  methods: {
    getModulos() {
      this.modulos = [];
      axios.get(url+'/modulos/')
        .then((res) => {
          let mods = res.data;
          this.modulos = mods.modulos
        })
    },
    reset() {
      this.dialog = !this.dialog;
      this.currentModule = {};
      this.capitulos = [];
    },
    editModulo(mod) {
      this.updating = true;
      this.currentModule = mod;
      this.capitulos = this.currentModule.capitulos;
      this.dialog = !this.dialog;
    },
    createModulo() {
      this.updating = false;
      this.currentModule = {};
      this.capitulos = [];
      this.dialog = !this.dialog;
    },
    addCapitulo() {
      let newCap = {
        nombre: '',
        url: '',
      }
      if(this.capitulos){
        this.capitulos.push(newCap);
      }else{
        this.capitulos = [newCap];
      }
    },
    moduleAction() {
      if(!this.updating){
        this.createNewModule();
      } else {
        this.updateModule();
      }
    },
    createNewModule() {
      let newModule = {
        nombre: this.currentModule.nombre,
        descripcion: this.currentModule.descripcion,
        capitulos: this.capitulos,
      }
      axios.post(`${url}/modulos/`, newModule)
        .then((res) => {
          if(res){
            this.dialog = !this.dialog;
            this.getModulos();
          }          
        })
    },
    updateModule() {
      let newModule = {
        nombre: this.currentModule.nombre,
        descripcion: this.currentModule.descripcion,
        capitulos: this.capitulos,
      }
      axios.put(`${url}/modulos/${this.currentModule.id}`, newModule)
        .then((res) => { 
          if(res){
            this.dialog = !this.dialog;
            this.getModulos();
          }          
        })
    },
  },
  mounted() {
    this.getModulos();
  },
};
</script>