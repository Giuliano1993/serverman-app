<script setup lang="ts">
import { defineProps,defineEmits, onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Server, Provider } from "../../types.ts";
import { Provider as ProviderName} from "../../types.ts";
import DigitalOcean from "../../providers/digitalOcean.ts";
import Netlify from "../../providers/netlify.ts";

import TieredMenu from 'primevue/tieredmenu';
import Vercel from "../../providers/vercel.ts";
import InstallServer from "../NewInstanceSetup/DigitalOcean/InstallServer.vue";


const confirm = useConfirm();
const toast = useToast();
const emit = defineEmits(['deletedServer']);
const showInstall = ref(false);

const props = defineProps<{
  type: Provider,
	site: Server;
}>();
const is_installed = ref(false);

const actions = [
   {
        label: 'Info',
        icon: 'pi pi-fw pi-info-circle',
        command: () => {
          console.log('Info clicked');
        }
      }
];
if(props.type.toLowerCase() === ProviderName.DIGITALOCEAN.toLowerCase()){
  actions.push({
    label: 'Install',
    icon: 'pi pi-fw pi-plus',
    command: () => {
      showInstall.value = true;
    }
  })
}
actions.push({
  label: 'Delete',
  icon: 'pi pi-fw pi-trash',
  command: () => {
    deleteServer();
  }
});



const actionItems = ref([
  {
    label: "Actions",
    icon: "pi pi-fw pi-cog",
    items: actions
  }
]);



const deleteServer = () => {
    console.log('chiama funzione')
    confirm.require({
        message: 'Do you want to delete this instance?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            switch(props.type.toLowerCase()){
              case ProviderName.NETLIFY.toLocaleLowerCase():{
                  const deleteResponse = await Netlify.deleteSite(props.site.id)
                  if(deleteResponse.status === 204){
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Server deleted', life: 3000 });
                    emit('deletedServer');
                  }else{
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'Something went wrong try afain later', life: 3000 });
                  }
                }
                break;
              case ProviderName.VERCEL.toLocaleLowerCase():{
                  const deleteResponse = await Vercel.deleteApp(props.site.id)
                  if(deleteResponse){
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Server deleted', life: 3000 });
                    emit('deletedServer');
                  }else{
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'Something went wrong try afain later', life: 3000 });
                  }
                }
                break;
              case ProviderName.DIGITALOCEAN.toLocaleLowerCase(): {
                const responseCode = await DigitalOcean.deleteDroplet(props.site.id);
                if(responseCode === 204){
                  toast.add({ severity: 'success', summary: 'Success', detail: 'Server deleted', life: 3000 });
                  emit('deletedServer');
                }else{
                  toast.add({ severity: 'error', summary: 'Rejected', detail: 'Something went wrong try afain later', life: 3000 });
                }
                break;
              }
              case ProviderName.HETZNER.toLocaleLowerCase():
                //Hetzner.deleteServer(site.id);
                break;
              default:
                break;
            }
        },
        reject: () => {
            //toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};

</script>

<template>
  <div class=" flex flex-row w-full">
    <div class="p-3">
      <img alt="user header"  class=" w-20" :src="site.preview_image_url ?? '/src/assets/server.png'"  width="100px"/>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <div>
        <p>{{site.name}}</p>
        <p v-if="props.type == Provider.DIGITALOCEAN">{{ site.ip }}</p>
      </div>
      <div>{{ type }}</div>
    </div>
    <div>
      <TieredMenu :model="actionItems"    />
    </div>
    
  </div>
  <InstallServer v-if="showInstall" :dropletId="site.id" ></InstallServer>
</template>



<style scoped>
</style>