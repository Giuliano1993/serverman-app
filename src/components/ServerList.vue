<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, ref } from "vue";
import DigitalOcean from "../providers/digitalOcean.ts";
import Hetzner from "../providers/hetzner.ts";
import Netlify from "../providers/netlify.ts";
import Vercel from "../providers/vercel.ts";
import type { Server } from "../types/types.d.ts";
import { Provider } from "../types/types.ts";
import ServerListElement from "./ServerListElement.vue";
const props = defineProps<{
	type: Provider;
}>();
const loading = ref(true);
const sites = defineModel();
defineEmits([]);

onMounted(async () => {
	let loadedSites: Server[] = [];
	//TODO improvable by creating provider variable which depends on the provider.
	// then the actions are all the same
	// before doing this i need to make a refactoring to have a unique method  for listing the server entitites

	switch (props.type.toLowerCase()) {
		case Provider.NETLIFY:
			if (Netlify.verifyConfig) {
				loadedSites = await Netlify.listSites().then((res: any) =>
					res.map(Netlify.convertServerToGeneric),
				);
			}
			break;
		case Provider.VERCEL:
			if (Vercel.verifyConfig) {
				loadedSites = await Vercel.projectList().then((res: any) =>
					res.map(Vercel.convertServerToGeneric),
				);
			}
			break;
		case Provider.DIGITALOCEAN:
			if (DigitalOcean.verifyConfig) {
				loadedSites = await DigitalOcean.getDroplets().then((res: any) =>
					res.map(DigitalOcean.convertServerToGeneric),
				);
			}
			break;
		case Provider.HETZNER:
			if (Hetzner.verifyConfig) {
				loadedSites = await Hetzner.serverList().then((res: any) =>
					res.map(Hetzner.convertServerToGeneric),
				);
			}
			break;
	}
	console.log(loadedSites);
	sites.value = loadedSites;
	loading.value = false;
});
</script>

<template>

  <div v-if="loading">
    <ProgressSpinner/>
  </div>
  <div class="servers-container" v-else>
    <h1 class=" text-center  text-3xl font-bold mb-3  capitalize"> {{ props.type }} servers</h1>
    <div class="list-container">
      <ServerListElement v-for="site in sites" :site="site" :key="site.id"></ServerListElement>
    </div>
  </div>
</template>

<style scoped>
.servers-container{
  height: 70vh;
  .list-container{
    height: 90%;
    overflow-y: scroll;
  }
}

</style>