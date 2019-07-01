<template>
  <div class="t-container">
    <v-chip :color="timer.isActive() ? 'green' : undefined">{{timer.timeString}}</v-chip>
    <div v-if="timer.isTimer()" class="timer-circle" @click="toggleTimer">
      <v-icon>{{timer.isActive() ? 'pause_circle_filled' : 'play_circle_filled'}}</v-icon>
    </div>

    <v-btn flat icon color="blue" @click="$store.commit('setTimerToEdit', timer)">
      <v-icon>settings</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  props: ["timer"],
  mounted() {},

  methods: {
    toggleTimer() {
      this.timer.toggle();
    }
  }
};
</script>
<style scoped>
.t-container {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
}

.t-container p {
  margin: 0;
  padding: 0 10px 0 10px;
}

.timer-circle {
  width: 40px;
  height: 40px;
  margin: 5px;
  border-radius: 50%;
  box-shadow: inset 0px 0px 0px 2px gray;
  transition: box-shadow 0.1s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.timer-circle:hover {
  box-shadow: inset 0px 0px 0px 3px gray;
}

.timer-circle.active {
  border-top: solid 2px green;
}

.play-pause {
  width: 60%;
  height: 60%;
}
</style>
