<script setup lang="ts">
import Dock from 'primevue/dock'
import 'primeicons/primeicons.css'
import { ref } from "vue";
import ConfigFialog from "./components/ConfigDialog.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import ServerList from "./components/ServerList/ServerList.vue";
import MakeNewModal from "./components/MakeNewModal.vue";


const showModal = ref(false);
const showCreate = ref(false);

const toggleConfigModal = () => {
	showModal.value = !showModal.value;
	console.log(showModal.value);
};
const toggleShowCreate = () => {
  showCreate.value = !showCreate.value;
}

const dockClickActions = (actionName: string) => {
  const action  = actionName.toLowerCase();
  switch (action) {
    case "new":
      toggleShowCreate()
      break;
    case "config":
      toggleConfigModal();
      break;
    case "search":
      break;
    default:

  }

}

const menuitems = [
  {
    label: "New",
    icon:  "plus"
  },{
    label: "Config",
    icon:  "cog"
  },{
    label: "Search",
    icon:  "search"
  },
]
</script>

<template>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
  <Dock position="left" :model="menuitems">
    <template #item="{item}">
      <a @click="dockClickActions(item.label)">
        <i :class="'pi pi-'+item.icon" style="font-size: 1rem"></i>
      </a>
    </template>
  </Dock>
  <ConfigFialog v-if="showModal"></ConfigFialog>
  <div class="flex flex-row justify-between" id="server-list-container">
    <ServerList type="Netlify"></ServerList>
    <ServerList type="Vercel"></ServerList>
    <ServerList type="digitalocean"></ServerList>
    <ServerList type="hetzner"></ServerList>
  </div>
  <MakeNewModal v-if="showCreate"></MakeNewModal>
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

.p-toolbar{
  background-color: #2b2d30;
}

.p-dock{
  z-index: 9999999999;
}
#server-list-container {
  margin-left: 4.5em;
}

</style>
