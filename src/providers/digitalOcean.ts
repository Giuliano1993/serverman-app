import type { DigitalOceanInterface, Server, Droplet } from "../types";
import { invoke } from "@tauri-apps/api/core";

const DigitalOcean: DigitalOceanInterface = {
	API_BASE_URL: "https://api.digitalocean.com/v2/",
	verifyConfig: import.meta.env.VITE_doAuthToken,
	buildBasicHeaders: () => {
		const { VITE_doAuthToken: token } = import.meta.env;
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
	},
	convertServerToGeneric: (baseServer) => {
		const s: Server = {
			id: baseServer.id,
			name: baseServer.name,
		};
		return s;
	},
	createDroplet: async function (name, size, image, region) {
		const headers = this.buildBasicHeaders();
		const createDropletUrl = `${this.API_BASE_URL}droplets`;
		const sshKeys = [import.meta.env.VITE_sshKey];

		const data = {
			name: name,
			size: size,
			//image: Number.parseInt(image),
			image: image,
			region: region,
			ssh_keys: sshKeys,
		};
		const droplet: Droplet | Error = await fetch(createDropletUrl, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data),
		})
			.then(async (res) => {
				console.log(res.status)
				if( res.status !== 202){
					const message = await res.json().then((res)=>res.message);
					throw new Error(message)
				}
				return res.json()})
			.then((res) => res.droplet)
			.catch((err) => err);
		return droplet;
	},
	deleteDroplet: async function (dropletId) {
		const headers = this.buildBasicHeaders();
		const url = `${this.API_BASE_URL}droplets/${dropletId}`;
		const response = await fetch(url, {
			method: "DELETE",
			headers: headers,
		}).then((res) => res.status);

		return response;	

	},
	getDroplet: async function (dropletId: number | string) {
		const headers = this.buildBasicHeaders();
		const url = `${this.API_BASE_URL}droplets/${dropletId}`;
		const droplet: Droplet | Error = await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res.droplet)
			.catch((err) => err);
		return droplet;
	},
	getDroplets: async function () {
		const headers = this.buildBasicHeaders();
		const url = `${this.API_BASE_URL}droplets?page=1`;
		return fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res.droplets)
			.catch((err) => {
				console.log("non va bene");
				console.log(err);
			});
	},
	getDistributions: async function (filter = "") {
		const headers = this.buildBasicHeaders();
		const url = `${this.API_BASE_URL}images?type=distribution`;
		return await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res.images)
			.then((res) => {
				const distros = res.filter(
					(distro: any) => distro.status === "available",
				);
				console.log(distros);
				if (filter === "") return distros;
				return distros.filter((distro: any) =>
					distro.title.includes(filter),
				);
			});
	},
	getRegions: async function () {
		const headers = this.buildBasicHeaders();
		const url = `${this.API_BASE_URL}regions`;
		return await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res.regions);
	},
	getSshKeys: async function () {
		const headers = this.buildBasicHeaders();
		const url = `${this.API_BASE_URL}account/keys`;
		return await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res.ssh_keys);
	},
	getSizes: async function () {
		const headers = this.buildBasicHeaders();
		const url = `${this.API_BASE_URL}sizes`;
		return await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res.sizes);
	},
	canConnectToDroplet: async function(dropletId, callback){
		let droplet = await this.getDroplet(dropletId);
		const dropletInterval = setInterval(async () => {
			console.log('.');
			if(droplet?.status === 'active'){
				clearInterval(dropletInterval);
				callback(droplet);
			}
			droplet = await this.getDroplet(dropletId);
		},1000)
	},
	sshInstallServer : (droplet: Droplet, commands: string[])=> {
		// exec ssh trough rust
		const {ip_address} = droplet['networks']['v4'].find(ip=>ip.type === "public");

		invoke("exec_ssh_commands",{ip:ip_address,commands:commands});
		return true
	}

};

export default DigitalOcean;
//export type DropletTaken = Awaited<ReturnType<typeof DigitalOcean.getDroplet>>
