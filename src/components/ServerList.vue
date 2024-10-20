<script setup lang="ts">
import { onMounted } from 'vue'
import Netlify from '../providers/netlify.ts';
import { NetlifySite, Provider, Server } from '../types/types.d.ts';
import ServerListElement from './ServerListElement.vue'
import Vercel from '../providers/vercel.ts';
const props = defineProps<{
  type: Provider,
}>();
const sites = defineModel()
defineEmits([])

onMounted( async ()=>{
  let loadedSites: Server[] = [];
  switch (props.type.toLowerCase()){
    case Provider.NETLIFY:
      if(Netlify.verifyNetlifyConfig){
        loadedSites = await Netlify.listSites().then((res : any)=>res.map(Netlify.convertServerToGeneric))
        
      }
      break
    case Provider.VERCEL:
        loadedSites = await Vercel.projectList().then((res: any) => res.map(Vercel.convertServerToGeneric));
        
      break
    case Provider.DIGITALOCEAN:
      break
  }
  console.log(loadedSites)
  sites.value = loadedSites
  
})

</script>

<template>
  <div class="servers-container">
    <h1> {{ props.type }} servers</h1>
    <div class="list-container">
      <ServerListElement v-for="site in sites" :site="site" :key="site.id"></ServerListElement>
    </div>
  </div>
</template>

<style scoped>
.servers-container{
  height: 70vh;
  .list-container{
    height: 90%;
    overflow-y: scroll;
  }
}

</style>