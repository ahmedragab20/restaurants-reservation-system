<template>
  <div id="app" class="min-h-screen bg-slate-100">
    <header class="flex items-center justify-center bg-white border-b">
      <div class="container px-2 mx-auto">
        <div class="flex flex-wrap items-center justify-between gap-3 py-5">
          <h1 class="text-3xl font-light">Reservations</h1>
          <div>
            <b-button
              style-type="primary"
              class="disabled:opacity-50 disabled:cursor-not-allowed"
              @click.native="disableAllReservations"
              :disabled="!availableBranches?.length || disablingReservations"
              :loading="disablingReservations"
            >
              Disable Reservations
            </b-button>
          </div>
        </div>
      </div>
    </header>
    <div class="container mx-auto mt-20 bg-white border rounded-lg">
      <div class="flex items-center justify-between p-3 sm:p-6">
        <div>
          <b-button
            class="px-4 py-2 text-sm border rounded-lg hover:bg-slate-100"
            :disabled="disablingReservations || loadingBranches"
            @click.native="fetchBranches"
          >
            <i class="bi bi-repeat"></i>
          </b-button>
        </div>
        <add-branch
          :branches="unAvailableBranches"
          @update-branches="allowBranchesReservations"
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
            <template v-if="loadingBranches">
              <tr class="w-full">
                <td
                  colspan="4"
                  class="flex items-center w-full gap-3 p-3 sm:p-5 text-slate-600"
                >
                  <b-spinner /> Loading
                </td>
              </tr>
            </template>
            <template v-else-if="availableBranches?.length">
              <tr
                v-for="branch in availableBranches"
                :key="branch.id"
                @click="toggleEditDialog(branch.id)"
                class="cursor-pointer select-none hover:bg-slate-10"
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
          </tbody>
        </table>
      </div>
    </div>

    <brach-settings
      :value="editDialog"
      :branch="findBranch(inActionBranchId) || {}"
      @closed="onBSettingsModelClaosed"
    />

    <!-- 
      @Notes:
        - I'll be moving each model to a separate component, it maybe not the best way of handling that
          but it supposed to be cleaner and easier to maintain and debug
     -->
  </div>
</template>

<script>
import BButton from "./components/App/BButton.vue";
import BSpinner from "./components/App/BSpinner.vue";
import AddBranch from "./components/ActionModels/AddBranch.vue";
import BrachSettings from "./components/ActionModels/BrachSettings.vue";

import { updateBranchs, getBranches } from "@/utils/api";
export default {
  components: { BButton, AddBranch, BSpinner, BrachSettings },
  name: "App",
  data() {
    return {
      branches: null,
      loadingBranches: false,
      disablingReservations: false,
      editDialog: false,
      inActionBranchId: "",
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
    findBranch: {
      get() {
        return (id) => {
          return this.branches?.data?.find((b) => b.id === id);
        };
      },
    },
    getNumberOfTables: {
      get() {
        return (branch) => {
          return (
            branch.sections?.map((sc) => {
              return (
                sc.tables?.map((t) => t.accepts_reservations === true)
                  ?.length || 0
              );
            })?.length || 0
          );
        };
      },
    },
  },
  watch: {
    editDialog: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.inActionBranchId = "";
        }
      },
    },
  },
  methods: {
    async fetchBranches() {
      try {
        this.loadingBranches = true;
        this.branches = await getBranches();
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingBranches = false;
      }
    },
    async disableAllReservations() {
      try {
        this.disablingReservations = true;
        const branches = this.availableBranches?.map((branch) => {
          return {
            id: branch.id,
            accepts_reservations: false,
          };
        });

        await updateBranchs(branches);

        // update the branches locally, for a faster response
        this.branches = {
          ...this.branches,
          data: this.branches?.data?.map((branch) => {
            return {
              ...branch,
              accepts_reservations: false,
            };
          }),
        };
      } catch (error) {
        console.error(error);
      } finally {
        this.disablingReservations = false;
      }
    },
    async allowBranchesReservations(branches) {
      this.branches?.data?.forEach((branch) => {
        if (branches?.includes(branch.id)) {
          branch.accepts_reservations = true;
        }
      });
    },
    toggleEditDialog(id) {
      // inActionBranchId will be set automatically to empty when the dialog is closed, therefor the findBranch method will return undefined
      this.inActionBranchId = id || "";

      this.editDialog = !this.editDialog;
    },
    /**
     * this method will be called when the branch settings model is closed
     * and will receive the following payload
     * @param {branch, newBranch} payload
     */
    onBSettingsModelClaosed(payload) {
      console.log({ payload });
      this.inActionBranchId = "";
      this.editDialog = false;
    },
  },
  async created() {
    await this.fetchBranches();
  },
};
</script>
