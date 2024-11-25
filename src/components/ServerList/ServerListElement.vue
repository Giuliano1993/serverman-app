<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps<{
	site: Server;
}>();
defineEmits([]);
</script>

<template>
  <div class=" flex flex-row w-full">
    <div class="p-3">
      <img alt="user header"  class=" w-20" :src="site.preview_image_url ?? '/src/assets/server.png'"  width="100px"/>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <div>
        <p>{{site.name}} ddd</p>
      </div>
      <div class="flex gap-3 justify-around w-full">
        <Button label="Cancel" severity="secondary" outlined class="" />
        <Button label="Save" class="" />
      </div>
    </div>
    
  </div>
</template>

<style scoped>
</style>