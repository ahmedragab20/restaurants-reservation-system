<template>
  <button
    :type="type"
    class="duration-200 cursor-pointer active:scale-95"
    :class="{
      'py-1.5 px-4 rounded-lg bg-primary text-white': styleType === 'primary',
    }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "button",
    },
    styleType: {
      type: String,
      default: "",
    },
  },
};
</script>
