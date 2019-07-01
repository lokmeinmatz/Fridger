<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Edit Timer</v-card-title>

      <v-card-text v-if="timer">
        <div style="display: flex; align-items: center;">
          <h3>{{timer.name}}</h3>
          <v-chip :color="timer.isActive() ? 'green' : undefined">{{timer.timeString}}</v-chip>
        </div>
        <v-divider style="margin: 10px 0;"/>
        <v-text-field
          label="Add Subtimer"
          :append-outer-icon="'done'"
          outline
          v-model="subname"
          @click:append-outer="addSubTimer"
        ></v-text-field>

        <!-- add / subtract time -->
        <div class="time-change">
          <v-btn small outline round @click="timer.changeTime(-3600)">-1h</v-btn>

          <v-btn small outline round @click="timer.changeTime(-600)">-10m</v-btn>

          <v-btn small outline round @click="timer.changeTime(-60)">-1m</v-btn>

          <v-btn small outline round @click="timer.changeTime(60)">+1m</v-btn>

          <v-btn small outline round @click="timer.changeTime(600)">+10m</v-btn>

          <v-btn small outline round @click="timer.changeTime(3600)">+1h</v-btn>
        </div>
        <v-divider style="margin: 10px 0;"/>
        <!-- delete -->
        <v-btn color="error" @click="removeTimer">DELETE TIMER</v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" flat @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Timer } from "../classes.js";

export default {
  name: "EditGroup",
  data() {
    return {
      subname: ""
    };
  },
  methods: {
    removeTimer() {
      this.$store.commit('deleteTimer', this.timer.id)
      this.dialog = false
    },
    addSubTimer() {
      if (this.subname.length > 0) {
        if (this.timer.children.length == 0) {
          this.timer.children.push(
            new Timer(this.subname, [], this.timer.getTime(), this.timer)
          );
          this.timer.currentSessionStart = null;
        } else {
          this.timer.children.push(
            new Timer(this.subname, [], 0, this.timer)
          );
          this.timer.currentSessionStart = null;
        }
      }
    }
  },
  computed: {
    dialog: {
      get() {
        return this.timer != undefined;
      },
      set(v) {
        if (v == false) {
          this.timer = undefined;
          this.subname = "";
        }
      }
    },
    timer: {
      get() {
        return this.$store.state.timerToEdit;
      },
      set(v) {
        this.$store.commit("setTimerToEdit", v);
      }
    }
  }
};
</script>
<style scoped>
.time-change {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: min-content;
}

.v-btn--round {
  padding: 0;
  min-width: 50px;
}


@media only screen and (max-width: 600px) {
  .time-change {
    flex-direction: column;
  }
}
</style>
