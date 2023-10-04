<template>
  <button
    :type="type"
    class="duration-200 cursor-pointer select-none active:scale-95"
    :class="{
      'py-1.5 px-4 rounded-lg bg-primary text-white': styleType === 'primary',
      'flex gap-2 items-center': loading,
    }"
  >
    <template v-if="loading"> <b-spinner /> <slot /> </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script>
import BSpinner from "./BSpinner.vue";
export default {
  components: { BSpinner },
  props: {
    type: {
      type: String,
      default: "button",
    },
    styleType: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
