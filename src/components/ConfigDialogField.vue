<script setup lang="ts">
import { readTextFile,writeFile, BaseDirectory,create, exists } from '@tauri-apps/plugin-fs';
import { path } from '@tauri-apps/api';
import { onMounted, ref } from 'vue';
import { initStronghold, insertRecord, getRecord } from '../utils/stronghold';


defineProps<{
  name: string
}>()
defineEmits([])
const confValue = ref("");

onMounted( async ()=>{
  console.log('dialog field create');
  
 /*const confFile = "serverman.conf"
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
 */


 const { stronghold, client } = await initStronghold();

const store = client.getStore();
const key = 'my_key';

// Insert a record to the store
insertRecord(store, key, 'secret value');

// Read a record from store
const value = await getRecord(store, key);
console.log(value); // 'secret value'

// Save your updates
await stronghold.save();

// Remove a record from store
await store.remove(key);
})

</script>

<template>
  <input type="text" :value="confValue">
</template>

<style scoped>
</style>