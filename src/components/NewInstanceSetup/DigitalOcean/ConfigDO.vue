<script setup lang="ts">
import InputText from 'primevue/inputtext';
import DigitalOcean from '../../../providers/digitalOcean';
import Checkbox from 'primevue/checkbox';
import { ref } from 'vue';
defineProps([])
const emit = defineEmits(['prev','next'])


const images = await DigitalOcean.getDistributions().then( res => res.map( d => ({label: `${d.distribution}: ${d.name}`, value: d.id})));
const sizes = await DigitalOcean.getSizes().then( res => res.map( s => ({label: s.slug, value: s.slug})));
const regions = await DigitalOcean.getRegions().then( res => res.map( r => ({label: r.name, value: r.slug})));

console.log(images)
console.log(sizes)

const name = ref('');
const selectedImage = ref('');
const selectedSize = ref('');
const selectedRegion = ref('');
const install = ref(false);
const isLoading = ref(false);

const creationError: Ref<null|string> = ref(null)
const createServer = async () => {
    isLoading.value = true;
    const res = await DigitalOcean.createDroplet(name.value, selectedSize.value, selectedImage.value, selectedRegion.value);
    isLoading.value = false;
    console.log(res)
    if(res instanceof Error){
      console.log("error here")
      creationError.value = res.messagec
    }
    emit('next',{
      name:name.value,
      image: selectedImage.value,
      size:selectedSize.value,
      install: install.value
    });
}
</script>

<template>

  <div class="flex flex-col" >
      <div class=" rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium" v-if="!isLoading">
        <div class=" flex flex-col">
          <div>
            <label for="name">Name</label>
            <div>

              <InputText id="name" v-model="name" />
            </div>
          </div>
          <div>
            <label for="image">Image</label>
            <div>
              <Select name="image" id="image" editable placeholder="Select an Image" v-model="selectedImage" :options="images" optionLabel="label" optionValue="value"  />
            </div>
          </div>
          <div>
            <label for="size">Size</label>

            <div>
              <Select name="size" id="size" editable placeholder="Select a Size" v-model="selectedSize" :options="sizes" optionLabel="label" optionValue="value"/>
            </div>
          </div>
          <div>
            <label for="region">Region</label>

            <div>
              <Select name="region" id="region" editable placeholder="Select a region" v-model="selectedRegion" :options="regions" optionLabel="label" optionValue="value"/>
            </div>
          </div>
          <div>
            <label for="installServer">Install Server</label>
            <Checkbox v-model="install" binary/>
          </div>
          </div>

          <div v-if="creationError != null" class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Info</span>
            <div class=" text-red-700">
               {{creationError}}
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