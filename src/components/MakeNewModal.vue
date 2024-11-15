<script setup>
import { getAvailableProviders } from '../utils/misc';
import { ref, watch } from 'vue';
import ConfigDO from './NewInstanceSetup/DigitalOcean/ConfigDO.vue';



defineProps([])
defineEmits([])
const providers = getAvailableProviders();

const selectedProvider = ref(0);
const serverConfigs = ref({});

watch(() => selectedProvider.value, (newValue) => {
    console.log(newValue)
})

const configNext = (data) => {
    console.log(data)
}


</script>

<template>
  <Stepper value="1" linear>
    <StepList>
        <Step value="1">Choose Provider</Step>
        <Step value="2"  v-if="selectedProvider ==  'digitalocean'">Configurations</Step>
        <Step value="3">Choose Repo</Step>
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
        <StepPanel v-slot="{ activateCallback }" value="2" v-if="selectedProvider == 'digitalocean' || selectedProvider == 'hetzner'">
            <Suspense v-if="selectedProvider == 'digitalocean'">
                <ConfigDO @next="configNext" @prev="activateCallback('1')"/>
                <template #fallback>
                    <div>Loading...</div>
                </template>
            </Suspense>
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