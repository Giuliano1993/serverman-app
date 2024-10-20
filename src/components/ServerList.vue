<script setup>
import { onMounted } from 'vue'
import { listSites } from '../utils/server.ts'
import Netlify from '../providers/netlify.ts';
defineProps([])
defineEmits([])

onMounted( async ()=>{
  const sites=  await Netlify.listSites();
  console.log(sites)
})

</script>

<template>
  Hello ServerList
</template>

<style scoped>
</style>