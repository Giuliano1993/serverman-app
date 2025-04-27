<script setup>
import { getAvailableProviders } from '../utils/misc';
import { ref, watch } from 'vue';
import ConfigDO from './NewInstanceSetup/DigitalOcean/ConfigDO.vue';
import InstallServer from "./NewInstanceSetup/DigitalOcean/InstallServer.vue";



defineProps([])
const emit = defineEmits(['serverCreated'])
const providers = getAvailableProviders();

const selectedProvider = ref(0);
const serverConfigs = ref({});
const installServer = ref(false)
const serverId = ref(null)

watch(() => selectedProvider.value, (newValue) => {
    console.log(newValue)
})

const configNext = (data, next) => {
    console.log(data)
    emit('serverCreated', data)
    installServer.value = data.install;
    serverId.value = data.dropletId;
    next("3")
}


const closeModal = () => {
    emit('close')
}
</script>

<template>
  <div class="w-screen h-screen bg-black bg-opacity-90 modal-box">
    <div class="bg-[#2b2d30] rounded-md p-3 modal-body border-green-950 border-solid border-2 w-2/3">
        <div class=" text-right text-xl cursor-pointer" @click="closeModal"><i class="pi pi-times ml-auto"></i></div>
      <div class="gap-3 justify-around ">

        <Stepper value="1" linear>
          <StepList>
              <Step value="1">Choose Provider</Step>
              <Step value="2"  v-if="selectedProvider ==  'digitalocean'">Configurations</Step>
              <Step value="3"  v-if="installServer">Installation options</Step>
              <Step value="4">Choose Repo</Step>
          </StepList>
          <StepPanels>
              <StepPanel v-slot="{ activateCallback }" value="1">

                  <div class="flex flex-col justify-center items-center">
                      <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                          <Select editable placeholder="Select a Provider" v-model="selectedProvider" :options="providers" />
                      </div>
                  </div>
                  <div class="flex pt-6 justify-end">
                      <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(selectedProvider ==  'digitalocean' ? '2' : '4')" />
                  </div>
              </StepPanel>
              <StepPanel v-slot="{ activateCallback }" value="2" v-if="selectedProvider == 'digitalocean' || selectedProvider == 'hetzner'">
                  <Suspense v-if="selectedProvider == 'digitalocean'">
                      <ConfigDO @next="(data)=>configNext(data,activateCallback)" @prev="activateCallback('1')"/>
                      <template #fallback>
                          <div>Loading...</div>
                      </template>
                  </Suspense>
              </StepPanel>
              <StepPanel v-slot="{ activateCallback }" value="3" v-if="installServer">
                     <InstallServer :dropletId="serverId"></InstallServer>
              </StepPanel>
              <StepPanel v-slot="{ activateCallback }" value="4">
                  <div class="flex flex-col">
                      <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                  </div>
                  <div class="pt-6">
                      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                  </div>
              </StepPanel>
          </StepPanels>
      </Stepper>
      </div>
    </div>
  </div>

</template>

<style scoped>
.modal-box{
  width: 100vw;
  height: 100vh;
  background-color: rgba(20, 20, 20, 0.9);
  position: fixed;
  top: 0;
  left: 0;
}
.modal-body{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>