<template>
  <div id="app" class="p-3 border">Hello wrold</div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  async created() {
    const res = await axios.get("/branches");
    console.log(res);
  },
};
</script>
