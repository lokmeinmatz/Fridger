<template>
  <v-container fluid>
    <AddGroup/>
    <EditGroup/>
  </v-container>
</template>

<script>
import Timer from '@/components/Timer.vue'
import AddGroup from "@/components/AddGroup.vue"
import EditGroup from "@/components/EditGroup.vue"

export default {
  components: {
    Timer,
    AddGroup,
    EditGroup
  },
  data() {
    return {
      open: []
    }
  },
  mounted() {
    if (this.$store.state.timerGroups.length == 0) {
      this.$store.dispatch("fetchGroups");
    }
    this.$store.commit('init')
  },
  computed: {
    timers() {
      return this.$store.state.timerGroups
    }
  }
};
</script>

