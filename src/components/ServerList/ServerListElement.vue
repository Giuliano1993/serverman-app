<script setup lang="ts">
import { defineProps,defineEmits, onMounted, ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { Server, Provider } from "../../types.ts";
import { Provider as ProviderName} from "../../types.ts";
import DigitalOcean from "../../providers/digitalOcean.ts";
import Netlify from "../../providers/netlify.ts";
import { invoke } from "@tauri-apps/api/core";
import TieredMenu from 'primevue/tieredmenu';


const confirm = useConfirm();
const toast = useToast();
const emit = defineEmits(['deletedServer']);

const props = defineProps<{
  type: Provider,
	site: Server;
}>();
const is_installed = ref(false);
const installServer = async () => {
  const dropletid = props.site.id.toString();
  const dotoken = import.meta.env.VITE_doAuthToken;
  const path = import.meta.env.VITE_localKeyFile

  invoke("run_node_ssh_install",{dropletid,dotoken, path}).then(response => {
    console.log(response);
  }).catch(error => {
    console.error("Error running hello world:", error);
  });
}
const actions = [
   {
        label: 'Info',
        icon: 'pi pi-fw pi-info-circle',
        command: () => {
          console.log('Info clicked');
        }
      }
];
if(props.type.toLocaleLowerCase() === ProviderName.DIGITALOCEAN.toLocaleLowerCase()){
  actions.push({
    label: 'Install',
    icon: 'pi pi-fw pi-plus',
    command: () => {
      installServer();
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
        <p>{{site.name}}</p>
        <p v-if="props.type == Provider.DIGITALOCEAN">{{ site.ip }}</p>
      </div>
      <div>{{ type }}</div>
    </div>
    <div>
      <TieredMenu :model="actionItems"    />
    </div>
    
  </div>
</template>

<style scoped>
</style>