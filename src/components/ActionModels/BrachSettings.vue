<template>
  <b-dialog v-model="dialog">
    <div class="bg-white border rounded-lg w-11/12 sm:w-[580px]">
      <template v-if="!!branch?.id">
        <!-- header -->
        <div class="p-4 pb-3 border-b border-slate-200">
          <h3 class="text-lg font-medium sm:text-xl">
            Edit {{ newBranch?.name }}
          </h3>
        </div>
        <!-- body -->
        <div class="p-4 max-h-[75svh] overflow-auto">
          <div class="px-4 py-2 mb-3 text-blue-600 rounded-lg bg-blue-50">
            branch working hours are {{ newBranch.opening_from }} -
            {{ newBranch.opening_to }}
          </div>
          <!-- Reservation Duration -->
          <div class="mb-3">
            <label for="reservation_duration" class="text-sm">
              Reservation Duration (minutes) <span class="text-red-400">*</span>
            </label>
            <b-input
              id="reservation_duration"
              v-model.number="newBranch.reservation_duration"
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
              <label
                :for="time.name"
                class="mb-1 text-sm capitalize text-slate-600"
              >
                {{ time.name }}
              </label>
              <div
                class="flex items-center justify-between gap-2 px-2 py-1.5 border rounded-lg"
              >
                <div class="w-[calc(100%-50px)] flex gap-2">
                  <template v-if="time.times?.length">
                    <div v-for="(tim, index) in time.times" :key="index">
                      <span
                        v-if="
                          !dateMatchesTargetTime({
                            day: time.name,
                            time: tim,
                          })
                        "
                        @click="
                          setTargetTime({
                            day: time.name,
                            time: tim,
                          })
                        "
                        class="px-2 py-1 text-xs border rounded-md cursor-pointer select-none border-primary"
                        ref="timeHandler"
                      >
                        {{ tim[0] }} - {{ tim[1] }}
                      </span>
                      <reservation-time-handler
                        v-else
                        @update-time="updateTime"
                        @remove-time="removeTime"
                        :time="targetTime"
                      ></reservation-time-handler>
                    </div>
                  </template>
                </div>
                <div
                  class="w-[45px] flex justify-end items-center flex-shrink-0"
                >
                  <b-button
                    :disabled="time.times?.length >= 3"
                    class="px-2 py-1 text-sm border rounded-lg shadow-sm border-slate-300 bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </b-button>
                </div>
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
import ReservationTimeHandler from "../ReservationTimeHandler.vue";

export default {
  components: { BButton, BDialog, BInput, BDropdown, ReservationTimeHandler },
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
      /**
       * the time to be deleted or modified
       */
      targetTime: {},
    };
  },
  computed: {
    tables() {
      return (
        this.newBranch?.sections
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
      if (!this.newBranch?.reservation_times) return [];

      return (
        Object.keys(this.newBranch?.reservation_times ?? {})?.map(
          (day, index) => ({
            id: `${day}-${index}-${this.newBranch.id}`,
            name: day,
            times: this.newBranch?.reservation_times?.[day],
          })
        ) ?? []
      );
    },
    dateMatchesTargetTime: {
      get() {
        return (date) => {
          // check that the day matches the target day and the time is exactly the same
          return (
            date?.day === this.targetTime?.day &&
            date?.time?.[0] === this.targetTime?.time?.[0] &&
            date?.time?.[1] === this.targetTime?.time?.[1]
          );
        };
      },
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
    branch: {
      handler(val) {
        this.newBranch = JSON.parse(JSON.stringify(val));
      },
      deep: true,
    },
  },
  methods: {
    filterSelectedTables(id) {
      this.selectedTables = this.selectedTables?.filter(
        (table) => table.id !== id
      );
    },
    setTargetTime(time) {
      this.targetTime = time;
    },
    updateTime(newTime) {
      console.log(newTime);
      this.newBranch = {
        ...this.newBranch,
        reservation_times: {
          ...this.newBranch?.reservation_times,
          [this.targetTime?.day]: this.newBranch?.reservation_times?.[
            this.targetTime?.day
          ]?.map((time) => {
            if (time[0] === this.targetTime?.time?.[0]) {
              return [newTime?.time?.[0], newTime?.time?.[1]];
            }
            return time;
          }),
        },
      };

      this.targetTime = {};
      console.log(this.newBranch?.reservation_times);
    },
    removeTime(time) {
      this.newBranch = {
        ...this.newBranch,
        reservation_times: {
          ...this.newBranch?.reservation_times,
          [this.targetTime?.day]: this.newBranch?.reservation_times?.[
            this.targetTime?.day
          ]?.filter((t) => t[0] !== time?.time?.[0]),
        },
      };

      this.targetTime = {};
      console.log(this.newBranch?.reservation_times);
    },
  },
};
</script>
