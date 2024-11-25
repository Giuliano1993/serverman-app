<script setup lang="ts">
import InputText from 'primevue/inputtext';
import DigitalOcean from '../../../providers/digitalOcean';
import { ref } from 'vue';
defineProps([])
const emit = defineEmits(['prev','next'])

enum WebServer{
    APACHE= "Apache",
    NGINX = "Nginx"
}


const scriptType: Ref<null|string>= ref(null)
const webServerType: Ref<null|WebServer>= ref(null)
const uploadRepo: Ref<boolean> = ref(false)
const installPhp: Ref<boolean> = ref(true)
const installGit: Ref<boolean> = ref(true)
const installNode: Ref<boolean> = ref(true)
const installComposer: Ref<boolean> = ref(true)
const installDocker: Ref<boolean> = ref(false)
const installMySql: Ref<boolean> = ref(false)
const installCoolify: Ref<boolean> = ref(false)

</script>

<template>

  <div class="flex flex-col h-48" >
      <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium" v-if="!isLoading">
        
      </div>
      <div v-else class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
      </div>
  </div>
  <div class="flex pt-6 justify-between">
      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="emit('prev')" />
      <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="createServer" />
  </div>
  
      
    
</template>

<style >
</style>