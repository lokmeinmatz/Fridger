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
      @input="updateBarcode()"></v-autocomplete>
      <p> {{ barCode }}</p>
    </v-flex>
    <v-flex v-else-if="enterMode=='barcode'" xs-12>
      <v-autocomplete 
      :label="'Enter Product ID (barcode)'" 
      v-model="barCode" 
      :items="knownProducts" 
      item-value="barCode"
      item-text="barCode" 
      @input="updateName()">
        <template slot="append-outer">
          <v-btn icon @click="toggleScanner()">
            <v-icon>camera</v-icon>
          </v-btn>
        </template>
      </v-autocomplete>
      <p> {{ name }}</p>
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
    <v-flex>
      <v-btn color="error" @click="returnToHome()">zurück zur Übersicht</v-btn>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn color="success" :disabled="productExists" @click="addProduct" v-on="productExists ? on : null">Produkt hinzufügen</v-btn>
      </template>
      <span>Das Produkt ist bereits bekannt.</span>
    </v-tooltip>
      <v-tooltip>

      </v-tooltip>
    </v-flex>

    <v-snackbar
      v-model="errorSnack.open"
      :timeout="3000"
      :top="true"
      color="error"
    >
      <p class="centered">{{ errorSnack.msg }}</p>
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      enterMode: "barcode",
      errorSnack: {
        open: false,
        msg: 'Bitte geb einen Namen an!'
      },
      name: "",
      barCode: "",
      // replace testNames and testCodes with store data
      // Autocomplete can get objects!!!
      showScanner: false,
      lastCodes: []
    };
  },
  methods: {
    toggleScanner() {
      this.showScanner = !this.showScanner;
    },
    returnToHome() {
      this.$router.go(-1)
    },
    addProduct() {
      if(this.name.length < 3) {
        this.errorSnack.open = true
        return
      }
    },
    collapsed(name) {
      return this.enterMode != name && this.$vuetify.breakpoint.width <= 700
    },
    updateBarcode() {
      // TODO get barcode
      this.barCode = this.$store.getters['knownProducts/getByName'](this.name).barCode
    },
    updateName() {
      this.name = this.$store.getters['knownProducts/getByBarCode'](this.barCode).productName
    },
    logIt(data) {
      this.lastCodes.push(data.codeResult.code)

      if(this.lastCodes.length > 2) {
        if(this.lastCodes[0] == this.lastCodes[1] && this.lastCodes[1] == this.lastCodes[2]) {
          // validated
          this.barCode = this.lastCodes[0]
          this.showScanner = false
        }
        this.lastCodes.shift()
      }
    }
  },
  computed: {
    knownProducts() {
      const r = this.$store.state.knownProducts.productList
      return r
    },
    productExists() {
      return this.$store.getters['knownProducts/getByName'](this.name) != undefined
    },
    readerSize() {
      let s =  {
        width: Math.min(500, window.innerWidth),
        height: Math.min(500, window.innerHeight - 200)
      }
      console.log(s)
      return s
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
</style>
