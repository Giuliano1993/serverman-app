<script setup>
import InputText from 'primevue/inputtext';
import DigitalOcean from '../../../providers/digitalOcean';
defineProps([])
defineEmits([])


const images = await DigitalOcean.getDistributions().then( res => res.map( d => ({label: d.name, value: d.slug})));
const sizes = await DigitalOcean.getSizes().then( res => res.map( s => ({label: s.slug, value: s.slug})));

console.log(images)
console.log(sizes)


</script>

<template>
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
        <Select name="image" id="image" editable placeholder="Select an Image" v-model="selectedImage" :options="images" optionLabel="label" optionValue="value"/>
      </div>
    </div>
    <div>
      <label for="size">Size</label>

      <div>
        <Select name="size" id="size" editable placeholder="Select a Size" v-model="selectedSize" :options="sizes" optionLabel="label" optionValue="value"/>
      </div>
    </div>
  </div>
      
    
</template>

<style scoped>
</style>