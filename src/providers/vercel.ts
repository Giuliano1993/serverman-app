import { fetch } from "@tauri-apps/plugin-http";
import type { VercelInterface, Server } from "../types";

const Vercel: VercelInterface = {
	API_BASE_URL: "https://api.vercel.com/v9/",
	verifyConfig: import.meta.env.VITE_vercelToken,
	buildBasicHeaders: () => {
		const { VITE_vercelToken: vercelToken } = import.meta.env;
		return {
			Authorization: `Bearer ${vercelToken}`,
			"Content-Type": "application/json",
		};
	},
	convertServerToGeneric: (baseServer) => {
		const s: Server = {
			id: baseServer.id,
			name: baseServer.name,
			public_url: baseServer.targets.production.url,
			repo: baseServer?.link,
		};
		return s;
	},
	projectList: async function () {
		const sites = await fetch(this.API_BASE_URL + "projects", {
			headers: this.buildBasicHeaders(),
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				return data.projects;
			});

		return sites;
	},
	deleteApp: async function (project) {
		return await fetch(this.API_BASE_URL + `projects/${project.id}`, {
			headers: this.buildBasicHeaders(),
			method: "delete",
		})
			.then((response) => {
				if (response.status === 204) {
					return true;
				}
			})
			.catch((err) => {
				return false;
			});
	},
};

export default Vercel;
