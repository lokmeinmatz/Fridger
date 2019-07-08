<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-btn to="/addFood?enter_mode=create">Neues Produkt hinzufügen</v-btn>
    </v-flex>
    <v-list>
      <v-list-tile v-for="item in knownProducts" :key="item.id">
        <v-list-tile-content>
          <v-list-tile-title v-html="item.productName"></v-list-tile-title>
          <v-list-tile-sub-title v-html="item.barCode"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-layout>
</template>

<script>
import { knownProductsPaths } from "../storeModules/knownProducts";
import { storedProductsPaths } from '../storeModules/storedProducts'
import { ProductTemplate, ProductInstance } from '../classes/Products';
export default {
  components: {},
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    knownProducts() {
      const r = this.$store.state.knownProducts.productList;
      return r;
    },
    productExists() {
      return this.$store.getters[knownProductsPaths.getters.G_FOOD_EXISTS](
        this.name,
        this.barCode
      );
    },
  }
};
</script>


<style scoped>
.inline {
  display: flex;
  max-width: 400px;
  align-items: center;
}

.quagga-view {
  max-width: 100vw;
  max-height: calc(100vh - 200px);
}

.centered {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}

.modiv {
  flex: 0 0 auto;
  position: relative;
  margin: 0;
  display: inline-flex;
}
</style>
