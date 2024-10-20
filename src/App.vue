<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import ServerList from './components/ServerList.vue'
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import SplitButton from 'primevue/splitbutton';
</script>

<template>
  <div id="actions-container">
    <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
          <div class="flex items-center gap-2">
              <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="..." fill="var(--p-text-color)" />
                  <path d="..." fill="transparent" />
              </svg>
              <Button label="Files" text plain />
              <Button label="Edit" text plain />
              <Button label="View" text plain />
          </div>
      </template>

      <template #end>
          <div class="flex items-center gap-2">
              <Button label="Share" severity="contrast" size="small" />
              <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 32px; height: 32px" />
          </div>
      </template>
  </Toolbar>


  </div>
  <div class="flex flex-row justify-between w-full">
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
