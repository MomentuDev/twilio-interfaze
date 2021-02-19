<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      floating
      permanent
    >
      <v-list-item class="px-2">
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon color="secondary">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>

export default {
  computed: {
  },
  data() {
    return {
      drawer: true,
      items: [
        { title: 'Home', icon: 'mdi-home', link: '/' },
        { title: 'Cargar Usuarios', icon: 'mdi-account-plus', link: '/cargarusuarios'},
        { title: 'Envío individual', icon: 'mdi-email-send', link: '/masive' },
        { title: 'Modulos masivo', icon: 'mdi-office-building', link: '/modulosmasivo' },
        { title: 'Masivo por compañía', icon: 'mdi-account-group', link: '/masivecompania' },
        { title: 'Masivo Link', icon: 'mdi-link', link: '/masivelink' },
        //{ title: 'Masivo nivel estres', icon: 'mdi-account-alert', link: '/masivenivelestres' },
        { title: 'Templates', icon: 'mdi-cellphone-message', link: '/templates' },
        { title: 'Modulos', icon: 'mdi-book-open-blank-variant', link: '/modulos' },        
      ],
      mini: true,
    };
  },
};
</script>
