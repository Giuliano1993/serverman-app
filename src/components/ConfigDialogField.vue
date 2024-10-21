<script setup lang="ts">
import { readTextFile,writeFile, BaseDirectory,create, exists } from '@tauri-apps/plugin-fs';
import { onMounted, ref } from 'vue';


defineProps<{
  name: string
}>()
defineEmits([])
const confValue = ref("");

onMounted( async ()=>{
  console.log('dialog field create');
  
 const confFile = "serverman.conf"
 const exsistConfig = await exists(confFile, {baseDir: BaseDirectory.AppData})
 if(exsistConfig){
  console.log('esist3')
 }else{
   console.log("non esiste");
  const file = await create(confFile,{
    baseDir: BaseDirectory.AppData
  })
  console.log("created")
  const checkExsistConfig = await exists(confFile, {baseDir: BaseDirectory.AppData})
  console.log(checkExsistConfig)
 }
 
})

</script>

<template>
  <input type="text" :value="confValue">
</template>

<style scoped>
</style>