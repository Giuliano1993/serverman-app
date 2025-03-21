import type { HetznerInterface, Server } from "../types";

const Hetzner: HetznerInterface = {
	API_BASE_URL: "https://api.hetzner.cloud/v1/",
	verifyConfig: import.meta.env.VITE_hetznerToken,
	buildBasicHeaders: () => {
		return {
			Authorization: `Bearer ${import.meta.env.VITE_hetznerToken}`,
			"Content-Type": "application/json",
		};
	},
	convertServerToGeneric: (baseServer) => {
		const s: Server = {
			id: baseServer.id,
			name: baseServer.name,
			ip: baseServer.public_net.ipv4.ip,
		};
		return s;
	},
	serverList: async function () {
		const servers = await fetch(this.API_BASE_URL + "servers", {
			headers: this.buildBasicHeaders(),
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					throw new Error(data.error.code);
				}
				return data.servers;
			});
		return servers;
	},
};

export default Hetzner;
