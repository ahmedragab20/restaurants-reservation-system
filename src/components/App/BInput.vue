<template>
  <input @input="$emit('input', $event?.target?.value)" />
</template>

<script>
export default {
  props: {
    value: {
      type: String || Number,
      default: "",
      required: true,
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
