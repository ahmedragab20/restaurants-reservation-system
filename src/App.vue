<template>
  <div id="app" class="p-3">
    <!-- components:
          - dropdown (select/multiselect)
          - dialog ✅
          - input ✅
          - button ✅
          - tags 🤦🏻‍♂️
          - time range picker
          - hint 🕗
    -->

    <div class="mb-3">
      <b-input
        v-model.number="inputValue"
        type="number"
        class="p-1 px-2 rounded-lg ring-1 focus:outline-none focus:ring-2 ring-primary"
      />
      {{ inputValue || "empty" }}
    </div>
    <div class="mb-3">
      <b-button
        @click.native="showDialog = true"
        class="px-2 py-1 text-white border rounded-xl bg-primary"
      >
        open dialog
      </b-button>
      <b-dialog v-model="showDialog">
        <div class="p-3 bg-white rounded-lg shadow-lg">
          <h1 class="text-xl font-bold">Dialog</h1>
          <p class="text-gray-500">Lorem ipsum dolor sit amet.</p>
        </div>
      </b-dialog>
    </div>
    <div class="mb-3">
      <div class="flex">
        <b-time-picker />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BDialog from "./components/App/BDialog.vue";
import BInput from "./components/App/BInput.vue";
import BButton from "./components/App/BButton.vue";
import BTimePicker from "./components/App/BTimePicker.vue";
export default {
  components: { BInput, BDialog, BButton, BTimePicker },
  name: "App",
  data() {
    return {
      inputValue: "",
      showDialog: false,
    };
  },
  async created() {
    const res = await axios.get("/branches");
    console.log(res);
  },
};
</script>
