<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import { ref, onMounted, watch } from 'vue';
import Github from "../../../gitProviders/github.ts";
import DigitalOcean from "../../../providers/digitalOcean.ts";
import { buildInstallServerScript } from '../../../utils/server.ts';
import { invoke } from "@tauri-apps/api/core";

const props = defineProps<{
  dropletId : string|integer
}>()
const emit = defineEmits(['prev','next'])

enum WebServer{
    APACHE= "Apache",
    NGINX = "Nginx"
}
const installServer = async (opts: any) => {
  
  const dotoken = import.meta.env.VITE_doAuthToken;
  const path = import.meta.env.VITE_localKeyFile
  const optsToCommandArray = buildInstallServerScript(opts)
  invoke("run_node_ssh_install",{ 
    dropletid: props.dropletId,
    dotoken, 
    path,
    opts
  }).then(response => {
    console.log(response);
  }).catch(error => {
    console.error("Error running hello world:", error);
  });
}

const isLoading: Ref<boolean> = ref(false)

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

onMounted(async ()=>{
  try{
    const repos = await Github.repoList();
    console.log(repos)
    repositoryChoices.value = repos.map((repo: any) => {
      return {
        value: repo.id,
        label: repo.name,
      }
    })
    console.log(repos);
  }catch (error) {
    console.error(error);
  }
});

const configureServer = ()=>{
  DigitalOcean.canConnectToDroplet(props.dropletId, (d)=>{
    const opts = {
      webServerType : chosenWebServer.value,
      uploadRepo : uploadRepo.value,
      installPhp : installPhp.value,
      installGit : installGit.value,
      installNode : installNode.value,
      installComposer : installComposer.value,
      installDocker : installDocker.value,
      installMySql : installMySql.value,
      installCoolify : installCoolify.value,
      installWebServer : installWebServer.value,
      chosenRepo : chosenRepo.value
    }
    console.log(d);
    console.log(opts);
    installServer(opts);

    /*const commands = buildInstallServerScript(opts)
    DigitalOcean.sshInstallServer(d, commands)*/
  })


}


</script>

<template>
<div class="w-[100vw] h-[100vh] absolute top-0 left-0 bg-black bg-opacity-55 flex flex-col justify-center items-center" >

  <div class="flex flex-col p-5 bg-slate-600 border-gray-500 rounded-md bg-opacity-100" >
      <div class=" bg-surface-50 dark:bg-surface-950  justify-center items-center font-medium" v-if="!isLoading">
        <div class="grid grid-cols-3 gap-2">
          <div class="col-span-3 text-center py-3">
            General Configurations
          </div>
          <div class="gap-4">
            <Checkbox class="mr-3" name="uploadRepo" inputId="uploadRepo" v-model="uploadRepo" binary/>
            <label for="uploadRepo">Use a repository</label>
          </div>
          <div class="col-span-2">
            <Select v-if="uploadRepo" editable placeholder="Select a repository" v-model="chosenRepo" :options="repositoryChoices" optionLabel="label" optionValue="value"/>
          </div>
          <div>
            <Checkbox class="mr-3" name="installWebServer" inputId="installWebServer" v-model="installWebServer" binary/>
            <label for="installWebServer">Install Web Server</label>
          </div>
          <div class="col-span-2">
            <Select v-if="installWebServer" editable placeholder="Select a web Server" v-model="chosenWebServer" :options="['Nginx','Apache']" />
          </div>
          <div class="col-span-3 text-center py-3">
            Items to install
          </div>
          <div>
            <Checkbox class="mr-3"  name="installPhp" inputId="installPhp" v-model="installPhp" binary/>
            <label for="installPhp">Install PHP</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installGit" inputId="installGit" v-model="installGit" binary/>
            <label for="installGit">Install Git</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installNode" inputId="installNode" v-model="installNode" binary/>
            <label for="installNode">Install Node</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installComposer" inputId="installComposer" v-model="installComposer" binary/>
            <label for="installComposer">Install Composer</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installDocker" inputId="installDocker" v-model="installDocker" binary/>
            <label for="installDocker">Install Docker</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installCoolify" inputId="installCoolify" v-model="installCoolify" binary/>
            <label for="installCoolify">Install Coolify</label>
          </div>
          <div>
            <Checkbox class="mr-3" name="installMySql" inputId="installMySql" v-model="installMySql" binary/>
            <label for="installMySql">Install MySql</label>
          </div>
          <div class="w-[100%] grow">
            <Button class="p-button-success p-button-outlined" @click="configureServer">Configure Server</Button>
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
</div>
  
  
      
    
</template>

<style >
</style>