<template>
  <div id="app" class="min-h-screen bg-slate-100">
    <header class="flex items-center justify-center bg-white border-b">
      <div class="container px-2 mx-auto">
        <div class="flex flex-wrap items-center justify-between gap-3 py-5">
          <h1 class="text-3xl font-light">Reservations</h1>
          <div>
            <b-button style-type="primary"> Disable Reservations </b-button>
          </div>
        </div>
      </div>
    </header>
    <div class="container mx-auto mt-20 bg-white border rounded-lg">
      <div class="flex items-center justify-end p-3 sm:p-6">
        <b-button
          class="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
        >
          Add Branches
        </b-button>
      </div>
      <!-- table of branches -->
      <div class="pb-3 overflow-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-y">
              <th class="p-3 text-left sm:p-5 min-w-[240px] max-w-sm">
                Branch Name
              </th>
              <th class="p-3 text-left sm:p-5 min-w-[210px] max-w-sm">
                Reference
              </th>
              <th class="p-3 text-left sm:p-5 min-w-[210px] max-w-sm">
                Number of Tables
              </th>
              <th class="p-3 text-left sm:p-5 min-w-[210px] max-w-sm">
                Reservation Duration
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="cursor-pointer select-none hover:bg-slate-50 hover:shadow"
            >
              <td class="p-3 sm:p-5">Branch 1</td>
              <td class="p-3 sm:p-5">B01</td>
              <td class="p-3 sm:p-5">1</td>
              <td class="p-3 sm:p-5">30 minutes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import BButton from "./components/App/BButton.vue";
export default {
  components: { BButton },
  name: "App",
  data() {
    return {};
  },
};
</script>
