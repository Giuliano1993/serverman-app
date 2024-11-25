import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Button from "primevue/button";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from "primevue/toast";
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';


const app = createApp(App);
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			prefix: "p",
			darkModeSelector: "system",
			cssLayer: false,
			ripple: true,
		},
	},
});

app.component("Stepper", Stepper)
.component("StepList", StepList)
.component("StepPanels", StepPanels)
.component("StepItem", StepItem)
.component("Step", Step)
.component("StepPanel", StepPanel)
.component("Button", Button)
.component("Select",Select)
.component("InputText",InputText)
.component("ConfirmDialog",ConfirmDialog)
.component("Toast",Toast)
;

app
.use(ConfirmationService)
.use(ToastService);

app.mount("#app");
