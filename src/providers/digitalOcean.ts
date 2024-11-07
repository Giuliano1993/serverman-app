import type { DigitalOceanInterface, Droplet, Server } from "../types/types";

const DigitalOcean: DigitalOceanInterface = {
	API_BASE_URL: "https://api.digitalocean.com/v2/",
	verifyConfig: import.meta.env.VITE_doAuthToken,
	buildBasicHeaders: () => {
		const { VITE_doAuthToken: token } = import.meta.env;
		return {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		};
	},
	convertServerToGeneric: (baseServer) => {
		const s: Server = {
			id: baseServer.id,
			name: baseServer.name,
		};
		return s;
	},
	createDroplet: async function (name, size, image) {
		const headers = this.buildBasicHeaders();
		const createDropletUrl = this.API_BASE_URL + "droplets";
		const sshKeys = [import.meta.env.VITE_sshKey];

		const data = {
			name: name,
			size: size,
			image: Number.parseInt(image),
			ssh_keys: sshKeys,
		};
		const droplet: Droplet | Error = await fetch(createDropletUrl, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((res) => res.droplet)
			.catch((err) => err);
		return droplet;
	},
	getDroplet: async function (dropletId: number | string) {
		const headers = this.buildBasicHeaders();
		const url = this.API_BASE_URL + `droplets/${dropletId}`;
		const droplet: Droplet | Error = await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res["droplet"])
			.catch((err) => err);
		return droplet;
	},
	getDroplets: async function () {
		const headers = this.buildBasicHeaders();
		const url = this.API_BASE_URL + `droplets?page=1`;
		return fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res["droplets"])
			.catch((err) => {
				console.log("non va bene");
				console.log(err);
			});
	},
	getDistributions: async function (filter = "") {
		const headers = this.buildBasicHeaders();
		const url = this.API_BASE_URL + `images?type=distribution`;
		return await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res["images"])
			.then((res) => {
				const distros = res.filter(
					(distro: any) => distro["status"] === "available",
				);
				if (filter === "") return distros;
				return distros.filter((distro: any) =>
					distro["title"].includes(filter),
				);
			});
	},
	getSshKeys: async function () {
		const headers = this.buildBasicHeaders();
		const url = this.API_BASE_URL + "account/keys";
		return await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res["ssh_keys"]);
	},
	getSizes: async function () {
		const headers = this.buildBasicHeaders();
		const url = this.API_BASE_URL + "sizes";
		return await fetch(url, {
			headers: headers,
		})
			.then((res) => res.json())
			.then((res) => res["sizes"]);
	},
};

export default DigitalOcean;
//export type DropletTaken = Awaited<ReturnType<typeof DigitalOcean.getDroplet>>
