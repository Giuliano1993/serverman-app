<script setup>
import { onMounted } from 'vue'
import { listSites } from '../utils/server.ts'
defineProps([])
defineEmits([])

onMounted( async ()=>{
  const sites=  await listSites();
  console.log(sites)
})

</script>

<template>
  Hello ServerList
</template>

<style scoped>
</style>