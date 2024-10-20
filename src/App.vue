<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import ServerList from './components/ServerList.vue'
</script>

<template>
  <div id="actions-container">
    

  </div>
  <div class="container flex gap-2 flex-row">
    <ServerList type="Netlify"></ServerList>
    <ServerList type="Vercel"></ServerList>
    <ServerList type="digitalocean"></ServerList>
  </div>
</template>

<style scoped>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}
#actions-container{
  height: 30vh;
}


</style>
