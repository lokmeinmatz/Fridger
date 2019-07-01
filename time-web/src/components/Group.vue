<template>
  <v-card>
    <v-toolbar card prominent>
      <v-toolbar-title>{{ id }}</v-toolbar-title>
    </v-toolbar>
    <v-list>
      <Timer :timerid="timer.id()" v-for="timer in matchedTimers" :key="timer.id()"></Timer>
    </v-list>

    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn flat icon v-on="on">
          <v-icon>add</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>New Timer</v-card-title>

        <v-card-text>
          <v-text-field outline label="Timer name" v-model="name"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="createTimer">Create</v-btn>
          <v-btn color="error" flat @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Timer from './Timer.vue'

export default {
  props: ["id"],
  components: {Timer},
  data: () => ({
    dialog: false,
    name: ""
  }),
  methods: {
    createTimer() {
      if (this.name.length == 0) return
      this.$store.dispatch('createTimer', {group: this.id, name: this.name})
      this.dialog = false
    }
  },
  computed: {
    matchedTimers() {
      return this.$store.state.timer.filter(t => t.groupID == this.id)
    }
  }
};
</script>

<style>
</style>
