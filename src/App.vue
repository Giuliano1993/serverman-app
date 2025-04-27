<script setup lang="ts">
import Dock from 'primevue/dock'
import 'primeicons/primeicons.css'
import { ref } from "vue";
import ConfigFialog from "./components/ConfigDialog.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MakeNewModal from "./components/MakeNewModal.vue";



import { Provider } from './types';
import ServerDatatable from './components/ServerDatatable.vue';


const showModal = ref(false);
const showCreate = ref(false);

const toggleConfigModal = () => {
	showModal.value = !showModal.value;
	console.log(showModal.value);
};
const toggleShowCreate = () => {
  showCreate.value = !showCreate.value;
}



</script>

<template>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
  <ConfigFialog v-if="showModal"></ConfigFialog>
  <div class="flex flex-row justify-between" >
    <h1>    
      <i class="pi pi-server"></i>
      Server List
    </h1>
    <div class=" flex gap-2">
      <Button @click="toggleShowCreate" class="p-button-success p-button-outlined">
        <i class="pi pi-plus"></i>
        New Server
      </Button>
      <Button @click="toggleConfigModal" class="p-button-success p-button-outlined">
        <i class="pi pi-cog"></i>
        Settings
      </Button>
    </div>
  </div>
  <div class="flex flex-row justify-between" id="server-list-container">
    <ServerDatatable> </ServerDatatable>
  </div>
  <MakeNewModal v-if="showCreate" @close="showCreate = false"></MakeNewModal>
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


</style>
