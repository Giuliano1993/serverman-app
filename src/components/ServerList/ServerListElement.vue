<script setup lang="ts">
import { defineProps,defineEmits } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Server, Provider } from "../../types.ts";
import { Provider as ProviderName} from "../../types.ts";
import DigitalOcean from "../../providers/digitalOcean.ts";
import Netlify from "../../providers/netlify.ts";

const confirm = useConfirm();
const toast = useToast();
const emit = defineEmits(['deletedServer']);

const props = defineProps<{
  type: Provider,
	site: Server;
}>();


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
              case ProviderName.VERCEL.toLocaleLowerCase():
                //Vercel.deleteProject(site.id);
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
        <p>{{site.name}} ddd</p>
      </div>
      <div class="flex gap-3 justify-around w-full">

        <Button label="Delete" severity="danger" outlined class="" @click="deleteServer" />
        <Button label="Info" class="" />
      </div>
    </div>
    
  </div>
</template>

<style scoped>
</style>