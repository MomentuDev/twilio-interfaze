<template>
  <v-container>
    <v-card height="100%" class="d-flex flex-row mb-12" extended>
        <sidebar></sidebar>
        <v-container class="mx-auto">
          <v-slide-y-transition mode="out-in">
            <v-layout row>
              <v-flex sm12 class="mx-auto" pa-6>
                <h1 class="display-2 text-center black--text font-weight-thin mt-12 mb-8">
                  Templates
                </h1>
                <h3>Tipo de template:</h3>
                <p>
                  Empresa: Envíos masivos genericos para empresas - e.g., Mensaje de bienvendia <br>
                  Link: Envíos masivos con una descripción y link a empresas <br>
                  Modulos: Envío automático del siguiente modulo a los miembros de las empresas seleccionadas
                </p>
                <h3>Significado:</h3>
                <p>
                  {{1}}: Nombre de la persona <br>
                  {{2}}: Nombre compañia <br>
                  {{3}}: Descripción o titulo del contenido <br>
                  {{4}}: Link al contenido <br>
                </p>
              </v-flex>
              <v-card class="mx-auto ma-4">
                <v-btn
                    fab
                    color="green accent-2"
                    bottom
                    left
                    absolute
                    @click="createTemp()"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                <v-card-title>
                  Templates
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
                        :items="templates"
                        :search="search"
                        multi-sort
                        class="elevation-1">
                        <template v-slot:item.actualizar="{ item }">
                          <v-btn
                            v-if="!item.fallida"
                            text
                            color="primary"
                            @click="editTemp(item)"
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
                        Gestión Templates
                      </v-card-title>
                      <v-card-text>
                        <v-form
                          ref="form"
                          lazy-validation
                          @submit.prevent="templateAction"
                        >
                          <v-text-field
                            v-model="currentTemp.category"
                            label="Category"
                            required
                          ></v-text-field>

                          <v-textarea
                            v-model="currentTemp.template"
                            label="Template"
                            required
                          ></v-textarea>

                          <v-btn
                            color="success"
                            class="mr-4"
                            @click="templateAction"
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
      templates: [],
      search: '',
      encabezadoTabla: [
        { text: 'Categoria', align: 'center', value: 'category' },
        { text: 'Template', align: 'center', value: 'template' },
        { text: 'Fecha', align: 'center', value: 'date' },
        { text: 'Actualizar', align: 'center', value: 'actualizar' }
      ],
      dialog: false,
      currentTemp: {},
      updating: false,
    };
  },
  methods: {
    getTemplates() {
      this.templates = [];
      axios.get(url+'/templates/')
        .then((res) => {
          let temps = res.data;
          this.templates = temps.templates
        })
    },
    reset() {
      this.dialog = !this.dialog;
      this.currentTemp = {};
    },
    editTemp(temp) {
      this.updating = true;
      this.currentTemp = temp;
      this.dialog = !this.dialog;
    },
    createTemp() {
      this.updating = false;
      this.currentTemp = {};
      this.dialog = !this.dialog;
    },
    templateAction() {
      if(!this.updating){
        this.createNewTemplate();
      } else {
        this.updateTemplate();
      }
    },
    createNewTemplate() {
      let newTemplate = {
        message: this.currentTemp.template,
        category: this.currentTemp.category
      }
      axios.post(`${url}/templates/`, newTemplate)
        .then((res) => {
          if(res){
            this.dialog = !this.dialog;
            this.getTemplates();
          }          
        })
    },
    updateTemplate() {
      let newTemplate = {
        message: this.currentTemp.template,
        category: this.currentTemp.category
      }
      axios.put(`${url}/templates/${this.currentTemp.id}`, newTemplate)
        .then((res) => { 
          if(res){
            this.dialog = !this.dialog;
            this.getTemplates();
          }          
        })
    },
  },
  mounted() {
    this.getTemplates();
  },
};
</script>