<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, ref } from "vue";
import DigitalOcean from "../../providers/digitalOcean.ts";
import Hetzner from "../../providers/hetzner.ts";
import Netlify from "../../providers/netlify.ts";
import Vercel from "../../providers/vercel.ts";
import ServerListElement from "./ServerListElement.vue";
import type { Server, Provider } from "../../types.ts";
import { Provider as ProviderName} from "../../types.ts";


const props = defineProps<{
	type: Provider;
}>();
const loading = ref(true);
const sites : Ref<Server[]>= defineModel();
defineEmits([]);

const error = ref(false);
const errorMessage = ref("");

const loadSites = async () => {
	loading.value = true;
	let loadedSites: Server[] = [];
	//TODO improvable by creating provider variable which depends on the provider.
	// then the actions are all the same
	// before doing this i need to make a refactoring to have a unique method  for listing the server entitites

	switch (props.type.toLowerCase()) {
		case ProviderName.NETLIFY:
			if (Netlify.verifyConfig) {
				loadedSites = await Netlify.listSites().then((res: any) =>
					res.response.map(Netlify.convertServerToGeneric)
				);
			}
			break;
		case ProviderName.VERCEL:
			if (Vercel.verifyConfig) {
				loadedSites = await Vercel.projectList().then((res: any) =>
					res.map(Vercel.convertServerToGeneric),
				);
			}
			break;
		case ProviderName.DIGITALOCEAN:
			if (DigitalOcean.verifyConfig) {
				loadedSites = await DigitalOcean.getDroplets().then((res: any) =>{
					return res.map(DigitalOcean.convertServerToGeneric)
				}).catch((e)=>{
					error.value = true;
					if(e.message.toLowerCase() === 'unauthorized'){
						loadedSites = [];
						errorMessage.value = 'Please check your DigitalOcean token';
					}
				});
			}
			break;
		case ProviderName.HETZNER:
			if (Hetzner.verifyConfig) {
				loadedSites = await Hetzner.serverList().then((res: any) =>
					res.map(Hetzner.convertServerToGeneric),
				).catch((e)=>{
					error.value = true;
					if(e.message.toLowerCase() === 'unauthorized'){
						loadedSites = [];
						errorMessage.value = 'Please check your Hetzner token';
					}
				});
			}
			break;
	}
	sites.value = loadedSites;
	loading.value = false;
}

onMounted(async () => {
	await loadSites();
});
</script>

<template>

  <div v-if="loading">
    <ProgressSpinner/>
  </div>
  <div class="servers-container" v-else>
    <h1 class=" text-center  text-3xl font-bold mb-3  capitalize"> {{ props.type }} servers</h1>
    <div class="list-container" v-if="!error">
      <ServerListElement v-for="site in sites" :site="site" :key="site.id" :type="type" @deletedServer="loadSites"></ServerListElement>
    </div>
	<div v-else>
	  <p class=" text-center font-bold mb-3  capitalize text-red-700"> {{ errorMessage }}</p>
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