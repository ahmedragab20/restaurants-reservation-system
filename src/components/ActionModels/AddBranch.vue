<template>
  <div>
    <b-button
      @click.native="toggleDialog"
      class="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100"
    >
      Add Branches
    </b-button>

    <b-dialog v-model="showDialog">
      <div class="bg-white border rounded-lg w-11/12 sm:w-[480px]">
        <!-- header -->
        <div class="p-4 pb-3 border-b border-slate-200">
          <h3 class="text-lg font-medium sm:text-xl">Add Branches</h3>
        </div>
        <!-- body -->
        <div class="p-4">
          <div class="mb-2">
            <label class="block -mb-1.5 text-sm font-medium text-slate-800">
              Select Branches
            </label>
            <div>
              <small class="text-slate-600">
                when you select a brach, click on it again to remove it.
              </small>
            </div>
          </div>
          <div>
            <b-dropdown
              v-model="selectedBranches"
              :options="branches"
              active-class="text-white shadow-xl bg-primary hover:bg-primary"
              option-classes="mb-1"
              searchKey="name"
              multiselect
            >
              <template #d-header>
                <div v-if="selectedBranches?.length">
                  <span
                    v-for="(option, index) in selectedBranches"
                    :key="index"
                    class="inline-flex items-center px-2 py-1 mr-1 text-sm font-medium leading-none text-white border rounded-lg bg-primary hover:bg-transparent hover:text-primary border-primary"
                    @click.stop="filterSelectedBranches(option.id)"
                  >
                    {{ option.name }}
                  </span>
                </div>
                <div v-else>Select Branches</div>
              </template>
              <template #d-body="{ option }">
                {{ option.name }}
              </template>
              <template #d-body-empty>
                <div class="flex items-center justify-center p-2 h-28">
                  <div class="text-center">
                    <div class="text-xl font-medium text-slate-600">
                      No Branches Found
                    </div>
                  </div>
                </div>
              </template>
            </b-dropdown>
          </div>
        </div>
        <!-- footer -->
        <div class="flex items-center justify-end gap-2 p-4 border-t">
          <b-button
            class="px-4 py-2 text-sm border rounded-lg hover:bg-slate-100"
            @click.native="toggleDialog"
          >
            Close
          </b-button>
          <b-button
            style-type="primary"
            class="px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedBranches?.length || saving"
            :loading="saving"
            @click.native="saveChanges"
          >
            Save
          </b-button>
        </div>
      </div>
    </b-dialog>
  </div>
</template>

<script>
import { updateBranchsReservations } from "@/utils/api";
import BButton from "../App/BButton.vue";
import BDialog from "../App/BDialog.vue";
import BDropdown from "../App/BDropdown.vue";
import { printerr } from "@/utils/console";
export default {
  components: { BButton, BDialog, BDropdown },
  props: {
    branches: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      showDialog: false,
      selectedBranches: [],
      saving: false,
    };
  },
  methods: {
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    filterSelectedBranches(id) {
      this.selectedBranches = this.selectedBranches?.filter(
        (branch) => branch.id !== id
      );
    },
    async saveChanges() {
      try {
        this.saving = true;
        const branches = this.selectedBranches.map((branch) => {
          return {
            id: branch.id,
            accepts_reservations: true,
          };
        });

        await updateBranchsReservations(branches);
      } catch (error) {
        printerr(error);
      } finally {
        // we assume that everything went well, without any errors
        this.saving = false;
        this.$emit(
          "update-branches",
          this.selectedBranches?.map((b) => b.id)
        );
        this.toggleDialog();
        this.selectedBranches = [];
      }
    },
  },
};
</script>
