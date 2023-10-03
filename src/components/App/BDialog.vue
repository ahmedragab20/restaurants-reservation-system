<template>
  <Transition name="fade-in">
    <div
      v-if="value"
      class="fixed inset-0 w-full h-screen overflow-auto flex justify-center items-center backdrop-blur-sm bg-[#f1f1f1c1]"
      @click.self="$emit('input', false)"
    >
      <slot />
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    document.body.style.overflow = "hidden";

    addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        this.$emit("input", false);
      }
    });
  },
  destroyed() {
    document.body.style.overflow = "auto";
  },
};
</script>
<style scoped>
.fade-in-leave-from,
.fade-in-enter-to {
  opacity: 1;
}
.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s ease-in-out;
}
</style>
