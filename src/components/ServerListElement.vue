<script setup lang="ts">
import { defineProps } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { Server } from '../types/types.d.ts'
import { preview } from 'vite';
const props = defineProps<{
  site: Server
}>()
defineEmits([])


</script>

<template>
  <Card style="width: 25rem; overflow: hidden">
      <template #header>
          <img alt="user header" :src="site.preview_image_url ?? '/src/assets/server.png'"  width="100px"/>
      </template>
      <template #title>{{site.name}}</template>
      <template #footer>
          <div class="flex gap-4 mt-1">
              <Button label="Cancel" severity="secondary" outlined class="w-full" />
              <Button label="Save" class="w-full" />
          </div>
      </template>
  </Card>
</template>

<style scoped>
</style>