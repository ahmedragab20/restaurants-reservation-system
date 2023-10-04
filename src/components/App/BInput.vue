<template>
  <input
    @input="$emit('input', $event?.target?.value)"
    :class="{
      'border rounded-lg px-2 py-1.5 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white':
        styleType === 'form',
    }"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String || Number,
      default: "",
      required: true,
    },
    styleType: {
      type: String,
      default: "form",
    },
  },
};
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
