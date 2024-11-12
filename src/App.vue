<script setup lang="ts">
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import SplitButton from "primevue/splitbutton";
import Toolbar from "primevue/toolbar";
import { ref } from "vue";
import ConfigFialog from "./components/ConfigDialog.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import ServerList from "./components/ServerList.vue";
import MakeNewModal from "./components/MakeNewModal.vue";


const showModal = ref(false);
const toggleConfigModal = () => {
	showModal.value = !showModal.value;
	console.log(showModal.value);
};
</script>

<template>
  <div id="actions-container">
    <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
          <div class="flex items-center gap-2">
              <span class="font-bold">SERVERMAN</span>
              <Button label="New" text plain />
              <Button label="Config" text plain @click="toggleConfigModal"/>
          </div>
      </template>
      <template #center>
        <IconField>
            <InputIcon>
                <i class="pi pi-search" />
            </InputIcon>
            <InputText placeholder="Search" />
        </IconField>
      </template>
      <template #end>
          <div class="flex items-center gap-2">
              <Button label="Share" severity="contrast" size="small" />
          </div>
      </template>
  </Toolbar>

  <ConfigFialog v-if="showModal"></ConfigFialog>
  </div>
  <div class="flex flex-row justify-between w-full">
    <ServerList type="Netlify"></ServerList>
    <ServerList type="Vercel"></ServerList>
    <ServerList type="digitalocean"></ServerList>
    <ServerList type="hetzner"></ServerList>
  </div>
  <MakeNewModal></MakeNewModal>
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
