<script setup>
import {getAvailableProviders} from "../../utils/misc.ts";
import { ref } from "vue";
defineProps([])
defineEmits([])
const providers = getAvailableProviders();

const selectedProvider = ref(0)
console.log(providers);

</script>

<template>
  <Select editable placeholder="Select a Provider" v-model="selectedProvider" :options="providers" />
</template>

<style scoped>
</style>