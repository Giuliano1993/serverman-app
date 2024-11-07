import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";

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

app.mount("#app");
