<template>
  <v-layout row wrap>
    <v-flex class="inline" :align-self-center="true" xs12>
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
    <v-flex v-if="enterMode=='name'" xs12>
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
    <v-flex v-else-if="enterMode=='barcode'" xs12>
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
    <v-flex v-else xs12>
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
    <!-- set best before -->
    <v-flex xs12><h3>Haltbar bis {{ bestBeforeDisplay }}</h3></v-flex>
    
    <v-flex xs12 sm6>
      <v-select
          :items="[0, 1, 2, 5, 10]"
          label="Schnelle Einstellung"
          @input="setBestBefore($event)"
          :value="daysBB"
        ></v-select>
    </v-flex>
    <v-flex xs12 sm6 align-self-center>
      <v-dialog v-model="datePicker" lazy width="290">
        <template v-slot:activator="{on}">
          <v-btn
            color="orange lighten-2"
            dark
            v-on="on"
          >
            Datum eingeben
        </v-btn>
        </template>
        <v-date-picker @input="datePicker=false" v-model="bestBeforeISO" first-day-of-week="1" :min="new Date().toISOString().substr(0, 10)"></v-date-picker>
      </v-dialog>
    </v-flex>
    <v-flex xs12>
      <v-switch v-model="allreadyOpen" label="bereits geöffnet?"></v-switch>
    </v-flex>
    <v-flex style="flex-direction: row;">
      <v-btn color="error" @click="returnToHome()">zurück zur Übersicht</v-btn>
      
      <v-btn v-if="enterMode=='create'"
        color="success"
        @click="createProduct()"
      >Produkt erstellen</v-btn>
          
      
      <v-btn v-else color="success" @click="addProduct()">Produkt hinzufügen</v-btn>
    </v-flex>

    <v-snackbar v-model="errorSnack.open" :timeout="3000" :top="true" color="error" multi-line>
      <p class="centered">{{ errorSnack.msg }}</p>
    </v-snackbar>
    <v-snackbar v-model="successSnack.open" :timeout="3000" :top="true" color="success" multi-line>
      <p class="centered">{{ successSnack.msg }}</p>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { knownProductsPaths } from "../storeModules/knownProducts";
import { storedProductsPaths } from '../storeModules/storedProducts'
import { ProductTemplate, ProductInstance } from '../classes/Products';

export default {
  components: {},
  props: ['enter_mode'],
  data() {
    return {
      bestBefore: new Date(),
      datePicker: false,
      allreadyOpen: false,
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
      this.bestBefore = new Date()
      this.lastCodes = []
    },
    setBestBefore(days) {
      /**@type Date */
      let bb = new Date()
      bb.setDate(bb.getDate() + days) // auto overflow
      this.bestBefore = bb
    },
    maybeShowTooltip() {
      if (this.productExists) {this.showProductExistsTooltip = true}
    },
    toggleScanner() {
      this.showScanner = !this.showScanner;
    },
    returnToHome() {
      this.$router.go(-1);
    },
    addProduct() {
      if (!this.productExists) {
        this.errorSnack.msg = 'Dieses Produkt ist uns unbekannt. Füge ein neues Produkt hinzu.'
        this.errorSnack.open = true;
        return;
      }

      // get template
      let template = this.$store.getters[knownProductsPaths.getters.G_GET_BY_NAME](this.name) 

      if(template == undefined || template.barCode != this.barCode) {
        this.errorSnack.msg = 'Dieses ProductTemplate konnte nicht gefunden werden.'
        this.errorSnack.open = true
        return
      }

      const prod = new ProductInstance(
        template, 
        this.$store.getters[storedProductsPaths.getters.G_GET_NEXT_IID], 
        this.bestBeforeISO, 
        this.allreadyOpen ? new Date().toISOString().substr(0, 10) : undefined
      )
      

      this.$store.dispatch(storedProductsPaths.actions.G_ADD_NEW_FOOD, prod)
      .then(() => {
        this.successSnack.msg = 'Produkt hinzugefügt'
        this.successSnack.open = true
        this.reset()
      }).catch(() => {
        this.errorSnack.msg = 'Produkt konnte nicht hinzugefügt werden.'
        this.errorSnack.open = true
      })
    },
    createProduct() {
      if (this.name.length < 3 || this.productExists) {
        this.errorSnack.msg = (this.productExists) ? 'Dieses Produkt existiert bereits.' : 'Der Name muss min. 3 Buchstaben lang sein!'
        this.errorSnack.open = true;
        return;
      }

      let prod = new ProductTemplate(this.name, this.barCode)
      this.$store.dispatch(knownProductsPaths.actions.G_ADD_NEW_FOOD, prod)
      .then(() => {
        this.successSnack.msg = 'Neues Produkt in Datenbank erstellt.'
        this.successSnack.open = true
        this.addProduct()
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
    enterMode: {
      get() {
        return this.enter_mode
      },
      set(v) {
        this.$router.replace({path: '/addFood', query: {enter_mode: v} })
      }
    },
    bestBeforeISO: {
      get() {
        return this.bestBefore.toISOString().substr(0, 10)
      },
      set(v) {
        this.bestBefore = new Date(v)
      }
    },
    bestBeforeDisplay() {
      /**@type Date */
      const d = this.bestBefore

      return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} | in ${this.daysBB} Tagen`
    },
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
      return s;
    },
    daysBB() {
      return Math.ceil((this.bestBefore.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
