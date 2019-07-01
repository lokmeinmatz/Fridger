<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="red lighten-2"
          dark
          v-on="on"
          fab
          bottom
          right
          fixed
        >
          <v-icon>add</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Add Group
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Name"
            outline
            v-model="name"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            flat
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="addGroup"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        name: ""
      }
    },
    methods: {
      addGroup() {
        if (this.name.length > 0) {
          // add group
          this.$store.commit('addGroup', this.name)

          this.dialog = false
          this.name = ''
        }
      }
    }
  }
</script>
