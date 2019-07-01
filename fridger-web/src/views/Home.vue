<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs-6>
        <v-card class="rounded">
          <v-btn flat round block color="primary" :to="'/addFood'">neuer Einkauf
            <v-icon right>add_circle_outline</v-icon>
          </v-btn>
          <v-btn flat round block color="primary">Sachen verbraucht
            <v-icon right>fastfood</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      open: []
    }
  },
  computed: {
    timers() {
      return this.$store.state.timerGroups
    }
  }
};
</script>


<style scoped>
.rounded {
  border-radius: 20px;
  display: flex;
  padding: 5px;
}

.rounded .v-btn {
  margin: 0;
}
</style>
