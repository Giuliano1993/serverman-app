<script async setup lang="ts">
import { readTextFile,writeFile, BaseDirectory,create, exists } from '@tauri-apps/plugin-fs';
import { path } from '@tauri-apps/api';
import { onMounted, ref, onBeforeMount } from 'vue';
import { initStronghold, insertRecord, getRecord } from '../utils/stronghold';
import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
import { store } from '../store';

defineProps<{
  name: string
}>()
defineEmits([])
const confValue = ref("");

//const { stronghold, client } = await initStronghold();
onMounted( async ()=>{
  console.log('dialog field create');

  

  const key = 'my_key';
  const { stronghold, client } = store.strongholdLoaded;
  const strongholdStore = client.getStore();

  const value = await getRecord(strongholdStore, key);
  console.log(value); // 'secret value'
  confValue.value = value;

})


const saveConf = async ()=>{
  console.log('savijng conf');
  const { stronghold, client } = store.strongholdLoaded;
  const strongholdStore = client.getStore();
  const key = 'my_key';
  insertRecord(strongholdStore, key, confValue.value);
  stronghold.save().then(async () => {
    const value = await getRecord(strongholdStore, key);
    console.log('Stronghold saved');
    console.log(value);
    confValue.value = value;
  }).catch((e) => {
    console.error('Error saving stronghold', e);
  });
  
}

</script>

<template>
  <Suspense>
    <template #default>
      <div>
        <input type="text" v-model="confValue">
        <button  @click="saveConf">Salva</button>
      </div>
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>

</template>

<style scoped>
</style>