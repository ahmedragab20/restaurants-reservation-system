<template>
  <b-dialog v-model="dialog">
    <div class="bg-white border rounded-lg w-11/12 sm:w-[580px]">
      <template v-if="!!branch?.id">
        <!-- header -->
        <div class="p-4 pb-3 border-b border-slate-200">
          <h3 class="text-lg font-medium sm:text-xl">
            Edit {{ branch?.name }}
          </h3>
        </div>
        <!-- body -->
        <div class="p-4 max-h-[75svh] overflow-auto">
          <div class="px-4 py-2 mb-3 text-blue-600 rounded-lg bg-blue-50">
            branch working hours are {{ branch.opening_from }} -
            {{ branch.opening_to }}
          </div>
          <!-- Reservation Duration -->
          <div class="mb-3">
            <label for="reservation_duration" class="text-sm">
              Reservation Duration (minutes) <span class="text-red-400">*</span>
            </label>
            <b-input
              id="reservation_duration"
              v-model="newBranch.reservation_duration"
              type="number"
              style-type="form"
              class="w-full"
            />
          </div>
          <!-- Branch Tables -->
          <div class="mb-3">
            <label for="branch_tables" class="text-sm"> Tables </label>
            <div>
              <b-dropdown
                v-model="selectedTables"
                :options="tables"
                active-class="text-white shadow-xl bg-primary hover:bg-primary"
                option-classes="mb-1"
                searchKey="name"
                multiselect
              >
                <template #d-header>
                  <div v-if="selectedTables?.length">
                    <span
                      v-for="(option, index) in selectedTables"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 mr-1 text-sm font-medium leading-none text-white border rounded-lg bg-primary hover:bg-transparent hover:text-primary border-primary"
                      @click.stop="filterSelectedTables(option.id)"
                    >
                      {{ option.section_name }} - {{ option.name }}
                    </span>
                  </div>
                  <div v-else>Select Tables</div>
                </template>
                <template #d-body="{ option }">
                  {{ option.section_name }} - {{ option.name }}
                </template>
                <template #d-body-empty>
                  <div class="flex items-center justify-center p-2 h-28">
                    <div class="text-center">
                      <div class="text-xl font-medium text-slate-600">
                        No Tables Found
                      </div>
                    </div>
                  </div>
                </template>
              </b-dropdown>
            </div>
          </div>
          <!-- reservation times -->
          <div>
            <div v-for="time in reservationTimes" :key="time.id">
              <label :for="time.name" class="text-sm capitalize text-slate-600">
                {{ time.name }}
              </label>
              <div class="px-2 py-1.5 border rounded-lg">
                <template v-if="time.times?.length">
                  <div
                    v-for="(t, index) in time.times"
                    :key="index"
                    class="px-1 py-0.5 rounded-md border-primary"
                  >
                    <span class="text-xs text-primary">{{ t }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <!-- footer -->
        <div class="flex items-center justify-end gap-2 p-4 border-t">
          <b-button
            class="px-4 py-2 text-sm border rounded-lg hover:bg-slate-100"
          >
            Close
          </b-button>
          <b-button
            style-type="primary"
            class="px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </b-button>
        </div>
      </template>
      <template v-else>
        <div class="p-3 text-center text-slate-600">couldn't find branch</div>
      </template>
    </div>
  </b-dialog>
</template>

<script>
import BButton from "@/components/App/BButton.vue";
import BDialog from "@/components/App/BDialog.vue";
import BInput from "@/components/App/BInput.vue";
import BDropdown from "@/components/App/BDropdown.vue";

export default {
  components: { BButton, BDialog, BInput, BDropdown },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    branch: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: this.value,
      newBranch: {},
      selectedTables: [],
    };
  },
  computed: {
    tables() {
      return (
        this.branch?.sections
          ?.map((section) => {
            return section?.tables?.map((table) => {
              return {
                section_name: section.name,
                id: table.id,
                name: table.name,
              };
            });
          })
          ?.flat() ?? []
      );
    },
    reservationTimes() {
      if (!this.branch?.reservation_times) return [];

      return (
        Object.keys(this.branch?.reservation_times ?? {})?.map(
          (day, index) => ({
            id: `${day}-${index}-${this.branch.id}`,
            name: day,
            times: this.branch?.reservation_times?.[day],
          })
        ) ?? []
      );
    },
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog: {
      handler(val) {
        if (!val) {
          this.$emit("closed", {
            branch: this.branch,
            newBranch: this.newBranch,
          });
          this.newBranch = {};
          this.selectedTables = [];
        }
      },
    },
  },
  methods: {
    filterSelectedTables(id) {
      this.selectedTables = this.selectedTables?.filter(
        (table) => table.id !== id
      );
    },
  },
};
</script>
