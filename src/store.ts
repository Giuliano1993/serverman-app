import { reactive } from "vue";
import { initStronghold } from "./utils/stronghold";
export const store = reactive({
	strongholdLoaded: await initStronghold(),
});
