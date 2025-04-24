<script setup lang="ts">
    import Netlify from '../providers/netlify';
    import Vercel from '../providers/vercel';
    import DigitalOcean from '../providers/digitalOcean';
    import Hetzner from '../providers/hetzner';
    import DataView from 'primevue/dataview';
    import { defineComponent, ref, onMounted } from 'vue';
import ServerListElement from './ServerList/ServerListElement.vue';


    const servers = ref([]);
    const loading = ref(true);
    const error = ref(false);

    const loadSites = async () => {
        if(Netlify.verifyConfig){
            const newSites = await Netlify.listSites().then((res: any) =>{
                return res.response.map((el)=>({
                    ...Netlify.convertServerToGeneric(el),
                    provider: "netlify",
                }));
            });
            servers.value = servers.value.concat(newSites);
        }
        if(Vercel.verifyConfig){
            const newSites = await Vercel.projectList().then((res: any) =>{
                return res.response.map((el)=>({
                    ...Vercel.convertServerToGeneric(el),
                    provider: "vercel",
                }));
            });
            servers.value = servers.value.concat(newSites);
        }
        if(DigitalOcean.verifyConfig){
            const newSites = await DigitalOcean.getDroplets().then((res: any) =>{
                return res.map((el)=>({
                    ...DigitalOcean.convertServerToGeneric(el),
                    provider: "digitalocean",
                }));
            });
            servers.value = servers.value.concat(newSites);
        }
        if(Hetzner.verifyConfig){
            const newSites = await Hetzner.serverList().then((res: any) =>{
                return res.map((el)=>({
                    ...Hetzner.convertServerToGeneric(el),
                    provider: "hetzner",
                }));
            });
            servers.value = servers.value.concat(newSites);
        }
    }

    onMounted(async () => {
        await loadSites();
    });
</script>
<template>
    <DataView :value="servers" :loading="loading" paginator :rows="20" >
        <template #list="slotProps">
            <ServerListElement v-for="item in slotProps.items" :site="item" :type="item.provider" @deletedServer="loadSites" />
        </template>
    </DataView>

</template>