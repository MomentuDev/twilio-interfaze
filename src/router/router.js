import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import User from '../views/User.vue';
import Masive from '../views/Masive.vue';
import MasiveCompania from '../views/MasiveCompany.vue';
import MasiveNivelEstres from '../views/MasiveNivelEstres.vue';
import Templates from '../views/Templates.vue';
import Modulos from '../views/Modulos.vue';
import MasiveModulos from '../views/MasiveModulos.vue';
import MasiveCompaniaLink from '../views/MasiveCompanyLink.vue';
import CargarUsuario from '../views/CargaUsuarios.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/user/:id',
    name: 'user',
    component: User,
  },
  {
    path: '/masive',
    name: 'Masive',
    component: Masive,
  },
  {
    path: '/masivecompania',
    name: 'MasiveCompania',
    component: MasiveCompania,
  },
  {
    path: '/masivenivelestres',
    name: 'MasiveNivelEstres',
    component: MasiveNivelEstres,
  },
  {
    path: '/templates',
    name: 'Templates',
    component: Templates,
  },
  {
    path: '/modulos',
    name: 'Modulos',
    component: Modulos,
  },
  {
    path: '/modulosmasivo',
    name: 'ModulosMasivos',
    component: MasiveModulos,
  },
  {
    path: '/masivelink',
    name: 'MasivoLink',
    component: MasiveCompaniaLink,
  },
  {
    path: '/cargarusuarios',
    name: 'CargarUsuarios',
    component: CargarUsuario
  }
];

const router = new VueRouter({
  routes,
});

export default router;
