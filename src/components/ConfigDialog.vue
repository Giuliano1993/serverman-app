<script setup>
import { onMounted } from 'vue';
import ConfigDialogField from './ConfigDialogField.vue';


defineProps([])
defineEmits([])

onMounted(()=>{
  console.log('dialog mounted');
  
})
</script>

<template>
  <div class=" bg-slate-400 rounded-md p-3">
    <ConfigDialogField name="DigitalOceanToken"/>
  </div>
</template>

<style scoped>
</style>