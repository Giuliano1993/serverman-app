<script setup lang="ts">
import InputText from 'primevue/inputtext';
import DigitalOcean from '../../../providers/digitalOcean';
import Checkbox from 'primevue/checkbox';
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
const installWebServer: Ref<boolean> = ref(true);
const chosenWebServer: Ref<boolean> = ref('');
const repositoryChoices: Ref<any[]> = ref([])
const chosenRepo = ref(null)

</script>

<template>

  <div class="flex flex-col p-5" >
      <div class=" bg-surface-50 dark:bg-surface-950  justify-center items-center font-medium" v-if="!isLoading">
        <div class="grid grid-cols-3 gap-2">
          <div class="col-span-3 text-center py-3">
            General Configurations
          </div>
          <div class="gap-4">
            <label for="uploadRepo">Use a repository</label>
            <Checkbox name="uploadRepo" v-model="uploadRepo" binary/>
          </div>
          <div class="col-span-2">
            <Select v-if="uploadRepo" editable placeholder="Select a repository" v-model="chosenRepo" :options="repositoryChoices" />
          </div>
          <div>
            <label for="installWebServer">Install Web Server</label>
            <Checkbox name="installWebServer" v-model="installWebServer" binary/>
          </div>
          <div class="col-span-2">
            <Select v-if="installWebServer" editable placeholder="Select a web Server" v-model="chosenWebServer" :options="['Nginx','Apache']" />
          </div>
          <div class="col-span-3 text-center py-3">
            Items to install
          </div>
          <div>
            <Checkbox class="mr-3"  name="installPhp" v-model="installPhp" binary/>
            <label for="installPhp">Install PHP</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installGit" v-model="installGit" binary/>
            <label for="installGit">Install Git</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installNode" v-model="installNode" binary/>
            <label for="installNode">Install Node</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installComposer" v-model="installComposer" binary/>
            <label for="installComposer">Install Composer</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installDocker" v-model="installDocker" binary/>
            <label for="installDocker">Install Docker</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installCoolify" v-model="installCoolify" binary/>
            <label for="installCoolify">Install Coolify</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installMySql" v-model="installMySql" binary/>
            <label for="installMySql">Install MySql</label>
          </div>

        </div>
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