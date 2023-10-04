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
        <add-branch
          :branches="unAvailableBranches"
          @update-branches="fetchBranches"
        />
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
            <template v-if="availableBranches?.length">
              <tr
                v-for="branch in availableBranches"
                :key="branch.id"
                class="cursor-pointer select-none hover:bg-slate-50 hover:shadow"
              >
                <td class="p-3 sm:p-5">
                  {{ branch.name }}
                </td>
                <td class="p-3 sm:p-5">
                  {{ branch.reference }}
                </td>
                <td class="p-3 sm:p-5">
                  {{ getNumberOfTables(branch) }}
                </td>
                <td class="p-3 sm:p-5">
                  {{ branch.reservation_duration }} Minutes
                </td>
              </tr>
            </template>
            <template v-else-if="availableBranches?.length === 0">
              <tr>
                <td colspan="4" class="p-3 text-center sm:p-5">
                  No branches available for reservations
                </td>
              </tr>
            </template>
            <template v-else>
              <tr class="w-full">
                <td
                  colspan="4"
                  class="flex items-center w-full gap-3 p-3 sm:p-5 text-slate-600"
                >
                  <b-spinner /> Loading
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 
      @Notes:
        - I'll be moving each model to a separate component, it maybe not the best way of handling that
          but it supposed to be cleaner and easier to maintain and debug
     -->
  </div>
</template>

<script>
import { getBranches } from "@/utils/api";
import BButton from "./components/App/BButton.vue";
import AddBranch from "./components/ActionModels/AddBranch.vue";
import BSpinner from "./components/App/BSpinner.vue";

export default {
  components: { BButton, AddBranch, BSpinner },
  name: "App",
  data() {
    return {
      branches: null,
    };
  },
  computed: {
    availableBranches() {
      return this.branches?.data?.filter(
        (b) => b.accepts_reservations === true
      );
    },
    unAvailableBranches() {
      return this.branches?.data?.filter(
        (b) => b.accepts_reservations === false
      );
    },
  },
  methods: {
    getNumberOfTables(branch) {
      return (
        branch.sections?.map((sc) => {
          return (
            sc.tables?.map((t) => t.accepts_reservations === true)?.length || 0
          );
        })?.length || 0
      );
    },
    async fetchBranches() {
      this.branches = null;
      this.branches = await getBranches();
    },
  },
  async created() {
    await this.fetchBranches();
  },
};
</script>
