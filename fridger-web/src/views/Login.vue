<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-card-title primary-title>
            <h3 class="headline">Login</h3>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-layout>
                <v-flex>
                  <v-text-field v-model="uname" label="Username" outline></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password" outline></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-layout>
              <v-btn color="success" @click="login" :loading="loading" :disabled="loading">Login</v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      uname: "",
      password: "",
      loading: false
    }
  },
  methods: {
    async login() {
      this.loading = true
      await this.$store.dispatch('connectUser', {uname: this.uname, password: this.password})

      this.loading = false
    }
  }
}
</script>
