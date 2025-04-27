<script setup lang="ts">
    import Netlify from '../providers/netlify';
    import Vercel from '../providers/vercel';
    import DigitalOcean from '../providers/digitalOcean';
    import Hetzner from '../providers/hetzner';
    import DataView from 'primevue/dataview';
    import { defineComponent, ref, onMounted, Ref, watch } from 'vue';
    import Skeleton from 'primevue/skeleton';
    import ServerListElement from './ServerList/ServerListElement.vue';
    import IconField from 'primevue/iconfield';
    import InputIcon from 'primevue/inputicon';



    const servers : Ref<any[]> = ref([]);
    const search = ref("");
    const filteredServers : Ref<any[]> = ref([]);
    const loading = ref(true);
    const error = ref(false);
    const selectedProvider = ref("");
    const providers = ref([
        { label: 'All', value: '' },
        { label: 'Netlify', value: 'netlify' },
        { label: 'Vercel', value: 'vercel' },
        { label: 'DigitalOcean', value: 'digitalocean' },
        { label: 'Hetzner', value: 'hetzner' },
    ]);
   
    const crossFilter = () => {
        console.log("crossFilter", selectedProvider.value, search.value)    
        if(selectedProvider.value === "") {
            filteredServers.value = servers.value.filter((server) => {
                return server.name.toLowerCase().includes(search.value.toLowerCase()) || server.ip?.includes(search.value);
            });
        } else if(selectedProvider.value !== "" && search.value.length > 0) {
            filteredServers.value = servers.value.filter((server) => {
                server.provider === selectedProvider.value
                return (server.name.toLowerCase().includes(search.value.toLowerCase()) || server.ip?.includes(search.value)) && server.provider === selectedProvider.value;
            });
        }else if( selectedProvider.value !== "" && search.value.length === 0) {
            filteredServers.value = servers.value.filter((server) => {
                return server.provider === selectedProvider.value;
            });
        }else{
            filteredServers.value = servers.value
        }
    }
    watch(search, (newValue)=>{
        crossFilter()
    });

watch(selectedProvider, (newValue) => {
    crossFilter();
});
    const loadSites = async () => {
        const promises = [];
        // TODO: refactor this
        if(Netlify.verifyConfig){
            try{
                const newSites =  Netlify.listSites().then((res: any) =>{
                    return res.response.map((el)=>({
                        ...Netlify.convertServerToGeneric(el),
                        provider: "netlify",
                    }));
                });
                promises.push(newSites);
                //servers.value = servers.value.concat(newSites);
            }catch(e){
                console.log("Netlify error: ", e);
            }
        }
        if(Vercel.verifyConfig){
            try {
                const newSites =  Vercel.projectList().then((res: any) =>{
                    return res.map((el)=>({
                        ...Vercel.convertServerToGeneric(el),
                        provider: "vercel",
                    }));
                });
                promises.push(newSites);
                //servers.value = servers.value.concat(newSites);
            } catch (error) {
                console.log("Vercel error: ", error);
            }
            
        }
        if(DigitalOcean.verifyConfig){
            try{
                const newSites =  DigitalOcean.getDroplets().then((res: any) =>{
                    return res.map((el)=>({
                        ...DigitalOcean.convertServerToGeneric(el),
                        provider: "digitalocean",
                    }));
                });
                promises.push(newSites);
                //servers.value = servers.value.concat(newSites);
            }catch(e){
                console.log("DigitalOcean error: ", e);
            }
        }
        if(Hetzner.verifyConfig){
            try{
                const newSites =  Hetzner.serverList().then((res: any) =>{
                    return res.map((el)=>({
                        ...Hetzner.convertServerToGeneric(el),
                        provider: "hetzner",
                    }));
                });
                promises.push(newSites);
                //servers.value = servers.value.concat(newSites);
            }catch(e){
                console.log("Hetzner error: ", e);
            }
        }
        const results = await Promise.allSettled(promises);
        servers.value = results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
        filteredServers.value = servers.value;
        loading.value = false;
    }

    onMounted(async () => {
        await loadSites();
    });
</script>
<template>
    <div class="flex flex-col gap-4 p-4 w-full">
        <div class="flex gap-3">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="search" placeholder="Search"/>
            </IconField>
            <Select v-model="selectedProvider" :options="providers" optionLabel="label" optionValue="value" placeholder="Select a provider" class="w-full md:w-20rem"  />
        </div>

        <DataView :value="filteredServers" :loading="loading" paginator :rows="5" class=" w-full" >
            <template #list="slotProps">
                <div class="flex flex-col" v-if="loading">
                    <div v-for="i in 6" :key="i">
                        <div class="flex flex-col xl:flex-row xl:items-start p-6 gap-6" :class="{ 'border-t border-surface-200 dark:border-surface-700': i !== 0 }">
                            <Skeleton class="!w-9/12 sm:!w-64 xl:!w-40 !h-24 mx-auto" />
                            <div class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-6">
                                <div class="flex flex-col items-center sm:items-start gap-4">
                                    <Skeleton width="8rem" height="2rem" />
                                    <Skeleton width="6rem" height="1rem" />
    
                                    <div class="flex items-center gap-4">
                                        <Skeleton width="6rem" height="1rem" />
                                        <Skeleton width="3rem" height="1rem" />
                                    </div>
                                </div>
                                <div class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                                    <Skeleton width="4rem" height="2rem" />
                                    <Skeleton size="3rem" shape="circle" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ServerListElement v-for="item in slotProps.items" :site="item" :type="item.provider" @deletedServer="loadSites" />
            </template>
        </DataView>
    </div>

</template>