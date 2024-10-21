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
  heee
  <ConfigDialogField name="DigitalOceanToken"/>
</template>

<style scoped>
</style>