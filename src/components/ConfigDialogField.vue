<script async setup lang="ts">
import { path } from "@tauri-apps/api";
import {
	BaseDirectory,
	create,
	exists,
	readTextFile,
	writeFile,
} from "@tauri-apps/plugin-fs";
import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { onBeforeMount, onMounted, ref } from "vue";
import { store } from "../store";
import { getRecord, initStronghold, insertRecord } from "../utils/stronghold";

const props = defineProps<{
	name: string;
}>();
const emit = defineEmits(["change"]);
const confValue = ref("");

//const { stronghold, client } = await initStronghold();
onMounted(async () => {
	console.log("dialog field create");

	const { client } = store.strongholdLoaded;
	const strongholdStore = client.getStore();

	const value = await getRecord(strongholdStore, props.name);
	console.log(value); // 'secret value'
	confValue.value = value;
});

const saveConf = async () => {
	console.log("savijng conf");
	const { stronghold, client } = store.strongholdLoaded;
	const strongholdStore = client.getStore();
	insertRecord(strongholdStore, props.name, confValue.value);
	stronghold
		.save()
		.then(async () => {
			const value = await getRecord(strongholdStore, props.name);
			confValue.value = value;
		})
		.catch((e) => {
			console.error("Error saving stronghold", e);
		});
};
</script>

<template>
  <Suspense>
    <template #default>
      <div class=" basis-1/4">
        <label :for="props.name" class="font-bold">{{props.name}}</label>
        <input type="text" :id="props.name" :name="props.name" v-model="confValue" @change="emit('change', confValue, props.name)">
        <!--<button  @click="saveConf" class="p-3 bg-green-300 rounded-md font-bold">Salva</button> -->
      </div>
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>

</template>

<style scoped>
</style>