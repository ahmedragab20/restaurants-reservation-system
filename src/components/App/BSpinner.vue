<template>
  <div
    class="inline-blockanimate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] motion-safe:animate-[spin_1.5s_linear_infinite]"
    :class="size"
    role="status"
  >
    <span
      class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >
      Loading...
    </span>
  </div>
</template>
<script>
export default {
  name: "BSpinner",
  props: {
    size: {
      type: String,
      default: "w-4 h-4",
    },
  },
};
</script>
