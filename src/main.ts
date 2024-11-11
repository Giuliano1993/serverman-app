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
.component("Select",Select);

app.mount("#app");
