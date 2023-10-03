<template>
  <div class="flex items-center justify-center">
    <div class="flex items-center justify-center px-2 border appearance-none">
      <select name="date-from" id="date_from">
        <option value="0"></option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>
    -
    <div class="flex items-center justify-center px-2 border appearance-none">
      <select name="date-to" id="date_to">
        <option value="0"></option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style>
select {
  /* for Firefox */
  -moz-appearance: none;
  /* for Chrome */
  -webkit-appearance: none;
}

/* For IE10 */
select::-ms-expand {
  display: none;
}
</style>
