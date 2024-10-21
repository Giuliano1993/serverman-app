<script setup lang="ts">
import { readTextFile,writeFile, BaseDirectory,create, exists } from '@tauri-apps/plugin-fs';
import { path } from '@tauri-apps/api';
import { onMounted, ref } from 'vue';


defineProps<{
  name: string
}>()
defineEmits([])
const confValue = ref("");

onMounted( async ()=>{
  console.log('dialog field create');
  
 const confFile = "serverman.conf"
 const homeDir = await path.homeDir();
 const filePathFull = `${homeDir}/${confFile}`
 const exsistConfig = await exists(filePathFull, {baseDir: BaseDirectory.AppData})
 if(exsistConfig){
  console.log('esist3')
 }else{
   console.log("non esiste");
  const file = await create(filePathFull,{
    baseDir: BaseDirectory.AppData
  })
  console.log("created")
  const checkExsistConfig = await exists(filePathFull, {baseDir: BaseDirectory.AppData})
  console.log(checkExsistConfig)
 }
 
})

</script>

<template>
  <input type="text" :value="confValue">
</template>

<style scoped>
</style>