<template>
  <v-layout row wrap>
    <v-flex xs12>
      <!-- autocomplete -->
      <v-text-field placeholder="filter" solo v-model="filterString"></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-list>
        <template v-for="(item, index) in storedProductsFiltered">
          <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
          <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>
          <v-list-tile v-else :key="item.id">
            <v-list-tile-avatar>
              <v-chip
                v-if="item.openSince!=undefined || item.isExpired()"
                :class="getChipClass(item)"
                text-color="white"
              >
                <v-icon v-if="item.openSince!=undefined">lock_open</v-icon>
                <v-icon v-if="item.isExpired()">timelapse</v-icon>
              </v-chip>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.template.productName }}</v-list-tile-title>
              <v-list-tile-sub-title v-html="item.bestBefore"></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-layout row>
                <v-btn icon ripple @click="openedItem(item)">
                  <v-icon color="orange lighten-1">lock_open</v-icon>
                </v-btn>
                <v-btn icon ripple style="margin-left: 10px;" @click="deleteItem(item)">
                  <v-icon color="error lighten-1">delete</v-icon>
                </v-btn>
              </v-layout>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { knownProductsPaths } from "../storeModules/knownProducts";
import { storedProductsPaths } from "../storeModules/storedProducts";
import { ProductTemplate, ProductInstance } from "../classes/Products";
export default {
  components: {},
  data() {
    return {
      filterString: ""
    };
  },
  methods: {
    openedItem(item) {
      this.$store.commit(storedProductsPaths.mutations.G_OPENED_ITEM, item)
    },
    deleteItem(item) {
      this.$store.commit(storedProductsPaths.actions.G_REMOVE_FOOD, item)
    },
    getChipClass(item) {
      const expired = item.isExpired();
      const open = item.openSince != undefined;

      return { open, expired, "state-chip": true };
    },
    getChipText(item) {
      const { open, expired } = this.getChipClass(item);
      if (open && expired) return "offen/abgelaufen";
      else if (open) return "offen";
      else if (expired) return "abgelaufen";
    }
  },
  computed: {
    storedProductsFiltered() {
      /**@type {ProductInstance[]} */
      let r = this.$store.state.storedProducts.productStore;
      if (this.filterString.length > 0)
        r = r.filter(i => i.filterString.includes(this.filterString));
      const timeFac = 1000 * 60 * 60;
      let sorted = r.sort((a, b) => {
        let d =
          (new Date(a.bestBefore).getTime() -
            new Date(b.bestBefore).getTime()) /
          timeFac;
        if (a.openSince) {
          let afac = (Date.now() - new Date(a.openSince).getTime()) / timeFac;
          d -= afac * 0.2;
        }
        if (b.openSince) {
          let bfac = (Date.now() - new Date(b.openSince).getTime()) / timeFac;
          d += bfac * 0.2;
        }
        return d;
      });
      return sorted;
    }
  }
};
</script>


<style>
.v-chip .v-chip__content {
  padding: 0 8px;
}
.state-chip.open {
  background-color: #ffb625;
}
.state-chip.expired {
  background-color: #ff6637;
}

.state-chip.open.expired {
  background: rgb(255, 182, 37);
  background: linear-gradient(
    135deg,
    rgba(255, 182, 37, 1) 30%,
    rgba(255, 102, 55, 1) 70%
  );
}
</style>
