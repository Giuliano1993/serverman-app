<script setup>
import Step1 from './NewInstanceSetup/Step1.vue';
import { getAvailableProviders } from '../utils/misc';
import { ref, watch } from 'vue';
import DigitalOcean from '../providers/digitalOcean';


defineProps([])
defineEmits([])
const providers = getAvailableProviders();

const selectedProvider = ref(0)

watch(() => selectedProvider.value, (newValue) => {
    console.log(newValue)
})

const images = await DigitalOcean.getDistributions();
const sizes = await DigitalOcean.getSizes();

console.log(images)
console.log(sizes)
</script>

<template>
  <Stepper value="1" linear>
    <StepList>
        <Step value="1">Choose Provider</Step>
        <Step value="2"  v-if="selectedProvider ==  'digitalocean'">Configurazioni</Step>
        <Step value="3">Scegli Repo</Step>
    </StepList>
    <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
            <div class="flex flex-col h-48 justify-center items-center">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                    <Select editable placeholder="Select a Provider" v-model="selectedProvider" :options="providers" />
                </div>
            </div>
            <div class="flex pt-6 justify-end">
                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')" />
            </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2" v-if="selectedProvider == 'digitalocean'">
            <div class="flex flex-col h-48">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                  <Suspense>
                    <Select editable placeholder="Select an Image" v-model="selectedImage" :options="images" />
                    <Select editable placeholder="Select a Size" v-model="selectedSize" :options="sizes" />
                  </Suspense>
                </div>
            </div>
            <div class="flex pt-6 justify-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
            </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
            <div class="flex flex-col h-48">
                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
            </div>
            <div class="pt-6">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
            </div>
        </StepPanel>
    </StepPanels>
</Stepper>

</template>

<style scoped>
</style>