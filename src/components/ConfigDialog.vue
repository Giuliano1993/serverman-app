<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ConfigDialogField from './ConfigDialogField.vue';
import { config } from 'process';

/*const configurations = {
  DigitalOceanToken : "",
  GitUser : "",
  GitToken : "",
  NetlifyToken : "",
  NetlifyUser : "",
  GitInstallationId : "",
  userMail : "",
  vercelToken : "",
  hetznerToken : ""
}*/

const configurations = ref({
  DigitalOceanToken : "",
  GitUser : "",
  GitToken : "",
  NetlifyToken : "",
  NetlifyUser : "",
  GitInstallationId : "",
  userMail : "",
  vercelToken : "",
  hetznerToken : ""
})

defineProps([])
defineEmits([])

onMounted(()=>{
  console.log('dialog mounted');
  
})

const handleChange = (value: string, name: string) => {
  console.log('name: ', name);
  console.log('value', value);
  configurations.value[name] = value;
  console.log(configurations.value);
}
</script>

<template>
  <div class=" bg-slate-400 rounded-md p-3 flex flex-wrap  gap-3 justify-around">

    <ConfigDialogField v-for="v,k in configurations" @change="handleChange" :name="k"/>
    
  </div>
</template>

<style scoped>
</style>