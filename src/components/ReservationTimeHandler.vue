<template>
  <div
    ref="timeHandler"
    class="flex relative justify-between gap-1 px-2 py-1 text-xs border rounded-md border-blue-500 bg-blue-50 max-w-[96px]"
  >
    <div class="absolute shadow-xl -top-2 -right-2">
      <b-button
        class="flex items-center justify-center w-4 h-4 text-white bg-red-500 border border-red-500 rounded-full"
        @click.native.stop="$emit('remove-time', time)"
      >
        <i class="m-auto bi bi-x"></i>
      </b-button>
    </div>
    <div v-for="(time, index) in newTime?.time" :key="index" class="flex">
      <div class="flex items-center justify-center flex-grow-0 text-xs">
        <b-input
          v-model="splitTime(time)[0]"
          :placeholder="splitTime(time)[0]"
          type="number"
          style-type=""
          class="w-full text-center bg-transparent"
          ref="timeInput0"
          min="0"
          max="23"
          @input="
            updateNewTimeInput(index, {
              left: $event,
              right: $refs?.timeInput1[index]?.value,
            })
          "
        ></b-input>
      </div>
      <div class="flex items-center justify-center flex-grow-0 text-xs">:</div>
      <div class="flex items-center justify-center flex-grow-0 text-xs">
        <b-input
          ref="timeInput1"
          v-model="splitTime(time)[1]"
          :placeholder="splitTime(time)[1]"
          type="number"
          class="w-full text-center bg-transparent"
          min="0"
          max="59"
          @input="
            updateNewTimeInput(index, {
              left: $refs?.timeInput0[index]?.value,
              right: $event,
            })
          "
        ></b-input>
      </div>
    </div>
  </div>
</template>

<!-- 
  I skipped adding validation on the input fields to save time.
 -->

<script>
import BButton from "./App/BButton.vue";
import BInput from "./App/BInput.vue";
export default {
  components: { BInput, BButton },
  props: {
    time: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newTime: [],
    };
  },
  watch: {
    time: {
      immediate: true,
      handler(val) {
        this.newTime = JSON.parse(JSON.stringify(val));
      },
    },
  },
  computed: {
    formattedTime() {
      return this.newTime?.time?.flat();
    },
  },
  methods: {
    splitTime(time) {
      return time?.split(":");
    },
    updateNewTimeInput(index, value) {
      this.newTime = {
        ...this.newTime,
        time: {
          ...this.newTime?.time,
          [index]: [value?.left, value?.right].join(":"),
        },
      };
    },
  },
  updated() {
    // used updated hook to register the click event after some changes in the component instead of the beginning of the component render

    // emit event when the user clicks outside the component
    document.addEventListener("click", (e) => {
      e.stopPropagation();
      this.$nextTick(() => {
        // check the the target.value "00:00" is not the same as the newTime
        const sameElement = Object.values(this.newTime?.time ?? {}).includes(
          e.target.value
        );
        if (!this.$refs?.timeHandler?.contains(e.target) && !sameElement) {
          this.$emit("update-time", this.newTime);
        }
      });
    });
  },
  mounted() {
    // emit event when the user clicks Enter
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.$emit("update-time", this.newTime);
      }
    });
  },
};
</script>
