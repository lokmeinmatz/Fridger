<template>
  <v-layout column>
    <v-flex class="inline" :align-self-center="true" xs-12>
      <v-btn-toggle v-model="enterMode" mandatory>
        <v-btn color="primary" value="name" flat>
          {{!collapsed('name') ? 'Enter by Name' : ''}}
          <v-icon :right="!collapsed('name')">font_download</v-icon>
        </v-btn>
        <v-btn color="primary" value="barcode" flat>
          {{!collapsed('barcode') ? 'Enter by BarCode' : ''}}
          <v-icon :right="!collapsed('barcode')">scanner</v-icon>
        </v-btn>
        <v-btn color="green" value="create" flat>
          {{!collapsed('create') ? 'Enter new Product' : ''}}
          <v-icon :right="!collapsed('create')">add_circle</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-flex>
    <v-flex v-if="enterMode=='name'" xs-12>
      <v-autocomplete
        :label="'Enter Product Name'"
        v-model="name"
        :items="knownProducts"
        item-value="productName"
        item-text="productName"
        @input="updateBarcode()"
      ></v-autocomplete>
      <p>{{ barCode }}</p>
    </v-flex>
    <v-flex v-else-if="enterMode=='barcode'" xs-12>
      <v-autocomplete
        :label="'Enter Product ID (barcode)'"
        v-model="barCode"
        :items="knownProducts"
        item-value="barCode"
        item-text="barCode"
        @input="updateName()"
      >
        <template slot="append-outer">
          <v-btn icon @click="toggleScanner()">
            <v-icon>camera</v-icon>
          </v-btn>
        </template>
      </v-autocomplete>
      <p>{{ name }}</p>
      <v-quagga
        v-if="showScanner"
        :onDetected="logIt"
        :readerSize="readerSize"
        :readerTypes="['ean_reader']"
      ></v-quagga>
    </v-flex>
    <v-flex v-else xs-12>
      <v-text-field :label="'Enter new Name'" v-model="name"></v-text-field>
      <v-text-field :label="'Enter Product ID (barcode)'" v-model="barCode">
        <template slot="append-outer">
          <v-btn icon @click="toggleScanner()">
            <v-icon>camera</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <v-quagga
        v-if="showScanner"
        :onDetected="logIt"
        :readerSize="readerSize"
        :readerTypes="['ean_reader']"
        class="quagga-view"
      ></v-quagga>
    </v-flex>
    <v-flex style="flex-direction: row;">
      <v-btn color="error" @click="returnToHome()">zurück zur Übersicht</v-btn>
      <v-tooltip v-if="enterMode=='create'" v-model="showProductExistsTooltip" bottom>
        <template v-slot:activator="{on}">
          <div @mouseover="maybeShowTooltip()"
            @mouseleave="showProductExistsTooltip = false" class="modiv">
          <v-btn
            color="success"
            :disabled="productExists"
            @click="createProduct()"
          >Produkt erstellen</v-btn>
          </div>
        </template>
        <span>Das Produkt ist bereits bekannt.</span>
      </v-tooltip>
      <v-btn v-else color="success" @click="addProduct()">Produkt hinzufügen</v-btn>
    </v-flex>

    <v-snackbar v-model="errorSnack.open" :timeout="3000" :top="true" color="error">
      <p class="centered">{{ errorSnack.msg }}</p>
    </v-snackbar>
    <v-snackbar v-model="successSnack.open" :timeout="3000" :top="true" color="success">
      <p class="centered">{{ successSnack.msg }}</p>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { knownProductsPaths } from "../storeModules/knownProducts";
import { ProductTemplate } from '../classes/Products';

export default {
  components: {},
  data() {
    return {
      enterMode: "barcode",
      errorSnack: {
        open: false,
        msg: "Bitte geb einen Namen an!"
      },
      successSnack: {
        open: false,
        msg: 'msg here'
      },
      showProductExistsTooltip : false,
      name: "",
      barCode: "",
      // replace testNames and testCodes with store data
      // Autocomplete can get objects!!!
      showScanner: false,
      lastCodes: []
    };
  },
  methods: {
    reset() {
      this.showProductExistsTooltip = false
      this.name = ''
      this.barCode = ''
      this.showScanner = false
      this.lastCodes = []
    },
    maybeShowTooltip() {
      console.log('ssss')
      if (this.productExists) {this.showProductExistsTooltip = true}
    },
    toggleScanner() {
      this.showScanner = !this.showScanner;
    },
    returnToHome() {
      this.$router.go(-1);
    },
    addProduct() {
      if (this.name.length < 3) {
        this.errorSnack.open = true;
        return;
      }
    },
    createProduct() {
      if (this.name.length < 3 || this.productExists) {
        this.errorSnack.open = true;
        return;
      }

      let prod = new ProductTemplate(this.name, this.barCode)
      this.$store.dispatch(knownProductsPaths.actions.G_ADD_NEW_FOOD. prod)
      .then(() => {
        this.successSnack.msg = 'Neues Produkt in Datenbank erstellt.'
        this.successSnack.open = true
        this.reset()
      })
      .catch(() => {
        // TODO error
      })
    },
    collapsed(name) {
      return this.enterMode != name && this.$vuetify.breakpoint.width <= 700;
    },
    updateBarcode() {
      let item = this.$store.getters[knownProductsPaths.getters.G_GET_BY_NAME](
        this.name
      );
      if (item != undefined) this.barCode = item.barCode;
      else {
        this.barCode = ''
      }
    },
    updateName() {
      const item = this.$store.getters[
        knownProductsPaths.getters.G_GET_BY_BARCODE
      ](this.barCode);
      if (item != undefined) this.name = item.productName;
      else this.name = ''
    },
    logIt(data) {
      this.lastCodes.push(data.codeResult.code);

      if (this.lastCodes.length > 2) {
        if (
          this.lastCodes[0] == this.lastCodes[1] &&
          this.lastCodes[1] == this.lastCodes[2]
        ) {
          // validated
          this.barCode = this.lastCodes[0];
          this.showScanner = false;
        }
        this.lastCodes.shift();
      }
    }
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
    readerSize() {
      let s = {
        width: Math.min(500, window.innerWidth),
        height: Math.min(500, window.innerHeight - 200)
      };
      console.log(s);
      return s;
    }
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
