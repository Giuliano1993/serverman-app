<script setup lang="ts">
import { config } from "process";
import { onMounted, ref } from "vue";
import ConfigDialogField from "./ConfigDialogField.vue";

const configurations = ref({
	DigitalOceanToken: "",
	GitUser: "",
	GitToken: "",
	NetlifyToken: "",
	NetlifyUser: "",
	GitInstallationId: "",
	userMail: "",
	vercelToken: "",
	hetznerToken: "",
});

defineProps([]);
defineEmits([]);

onMounted(() => {
	console.log("dialog mounted");
});

const handleChange = (value: string, name: string) => {
	//console.log('name: ', name);
	//console.log('value', value);
	configurations.value[name] = value;
	//console.log(configurations.value);
};

const saveConfigs = () => {
	console.log("saving configs");
	console.log(configurations.value);
};
</script>

<template>
  <div class=" w-full h-full bg-black bg-opacity-70">
    <div class="bg-slate-400 rounded-md p-3 modal-body border-green-950 border-solid border-2">
      <div class="  flex flex-wrap  gap-3 justify-around ">
    
        <ConfigDialogField v-for="v,k in configurations" @change="handleChange" :name="k"/>
        
      </div>
      <button @click="saveConfigs" class=" rounded-md p-1 bg-green-950">Save</button>
    </div>
  </div>
</template>


<style scoped>
  .modal-body{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;

  }
</style>