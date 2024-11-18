<script setup>
import InputText from 'primevue/inputtext';
import DigitalOcean from '../../../providers/digitalOcean';
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
const isLoading = ref(false);
const createServer = async () => {
  isLoading.value = true;
  const res = await DigitalOcean.createDroplet(name.value, selectedSize.value, selectedImage.value, selectedRegion.value);
  isLoading.value = false;
  emit('next',{name:name.value, image: selectedImage.value, size:selectedSize.value});
}
</script>

<template>
  <div class="flex flex-col h-48">
      <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
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
          </div>
      </div>
  </div>
  <div class="flex pt-6 justify-between">
      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="emit('prev')" />
      <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="createServer" />
  </div>
  
      
    
</template>

<style scoped>
</style>