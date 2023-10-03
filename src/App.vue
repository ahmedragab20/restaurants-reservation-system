<template>
  <div id="app" class="p-3 border flex">
    <!-- components:
          - dropdown (select/multiselect)
          - dialog
          - input
          - button
          - tags
          - time range picker
          - hint
    -->

    <div class="border rounded-xl overflow-hidden">
      <select
        name="na"
        id="od"
        class="px-2 py-1 appearance-none focus:outline-none"
      >
        <option value="0">00</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      -
      <select
        name="na"
        id="od"
        class="px-2 py-1 appearance-none focus:outline-none"
      >
        <option value="0">00</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
