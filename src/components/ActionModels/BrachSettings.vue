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
                @option-clicked="bDropdownOptionClicked"
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
              <div class="flex justify-between">
                <label
                  :for="time.name"
                  class="mb-1 text-sm capitalize text-slate-600"
                >
                  {{ time.name }}
                </label>
                <div>
                  <b-button
                    v-if="time.name === 'saturday'"
                    class="px-2 py-1 text-xs text-primary"
                    @click.native="applyOnAllDays"
                  >
                    Apply on all days
                  </b-button>
                </div>
              </div>
              <div
                class="flex items-center justify-between gap-2 px-2 py-1.5 border rounded-lg mb-1"
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
                        :id="`${time.name}-${tim[0]}-${tim[1]}`"
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
                  <template v-else> Add Available Reservation Times </template>
                </div>
                <div
                  class="w-[45px] flex justify-end items-center flex-shrink-0"
                >
                  <b-button
                    :disabled="time.times?.length >= 3"
                    class="px-2 py-1 text-sm border rounded-lg shadow-sm border-slate-300 bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click.native.stop="addNewTime(time.name)"
                  >
                    +
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- footer -->
        <div class="flex items-center justify-between gap-2 p-4 border-t">
          <div>
            <b-button
              @click.native.stop="disableReservations"
              class="px-4 py-2 text-sm text-red-200 border border-red-200 rounded-lg hover:bg-red-400 hover:border-red-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disable Reservations
            </b-button>
          </div>
          <div class="flex items-center justify-end gap-2">
            <b-button
              @click.native.stop="dialog = false"
              class="px-4 py-2 text-sm border rounded-lg hover:bg-slate-100"
            >
              Close
            </b-button>
            <b-button
              :disabled="sendingRequest"
              :loading="sendingRequest"
              @click.native.stop="
                $emit('update-branch-settings', {
                  branch,
                  newBranch,
                })
              "
              style-type="primary"
              class="px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </b-button>
          </div>
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
    sendingRequest: {
      type: Boolean,
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
                ...table,
              };
            });
          })
          ?.flat() ?? []
      );
    },
    reservationTimes() {
      if (!this.newBranch?.reservation_times) return [];

      return (
        Object.keys(this.newBranch?.reservation_times ?? {})
          .sort((a, b) => {
            const days = [
              "saturday",
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
            ];
            return days.indexOf(a) - days.indexOf(b);
          })
          .map((day, index) => ({
            id: `${day}-${index}-${this.newBranch.id}`,
            name: day,
            times: this.newBranch?.reservation_times?.[day],
          })) ?? []
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
          this.$emit("closed");
          this.newBranch = {};
          this.selectedTables = [];
        }
      },
    },
    branch: {
      handler(val) {
        this.newBranch = JSON.parse(JSON.stringify(val));
        this.newBranch.sections?.forEach((sc) => {
          sc.tables?.forEach((t) => {
            if (t.accepts_reservations === true) {
              this.selectedTables.push({
                section_name: sc.name,
                id: t.id,
                name: t.name,
                ...t,
              });
            }
          });
        });
      },
      deep: true,
    },
  },
  methods: {
    bDropdownOptionClicked({ option, selected }) {
      // find option in newBranch and update accepts_reservations to selected
      const section = this.newBranch?.sections?.find((s) =>
        s.tables?.some((t) => t.id === option.id)
      );
      if (section) {
        const table = section.tables.find((t) => t.id === option.id);
        if (table) {
          table.accepts_reservations = selected;
        }
      }
    },
    filterSelectedTables(id) {
      this.selectedTables = this.selectedTables?.filter(
        (table) => table.id !== id
      );
    },
    setTargetTime(time) {
      this.targetTime = time;
    },
    updateTime(newTime) {
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
    },
    addNewTime(day) {
      this.newBranch = {
        ...this.newBranch,
        reservation_times: {
          ...this.newBranch?.reservation_times,
          [day]: [
            ...(this.newBranch?.reservation_times?.[day] ?? []),
            ["00:00", "00:00"],
          ],
        },
      };
    },
    /**
     * applies the saturday times on all days
     */
    applyOnAllDays() {
      this.newBranch = {
        ...this.newBranch,
        reservation_times: {
          ...this.newBranch?.reservation_times,
          sunday: this.newBranch?.reservation_times?.saturday,
          monday: this.newBranch?.reservation_times?.saturday,
          tuesday: this.newBranch?.reservation_times?.saturday,
          wednesday: this.newBranch?.reservation_times?.saturday,
          thursday: this.newBranch?.reservation_times?.saturday,
          friday: this.newBranch?.reservation_times?.saturday,
        },
      };
    },
    disableReservations() {
      this.newBranch = {
        ...this.newBranch,
        accepts_reservations: false,
      };

      this.$emit("update-branch-settings", {
        branch: this.branch,
        newBranch: this.newBranch,
      });
      this.dialog = false;
    },
  },
};
</script>
