import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";
import { Command } from "@tauri-apps/plugin-shell";
const API_BASE_URL = "https://api.github.com/";

const Github: GitHub = {
	repoList: async () => {
		const { VITE_gitUser: gitUser, VITE_gitToken: gitToken } = import.meta.env;
		const url = API_BASE_URL + `users/${gitUser}/repos?per_page=100`;
		return await fetch(url, {
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${gitToken}`,
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}).then((res) => res.json());
	},
	getDeployKey: async (repo) => {
		const { VITE_gitUser: gitUser, VITE_gitToken: gitToken } = import.meta.env;
		const url = API_BASE_URL + `repos/${gitUser}/${repo}/keys`;
		console.log(url);
		return await fetch(url, {
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${gitToken}`,
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}).then((res) => res.json());
	},
	createDeployKey: async (repo, keyName) => {
		const {
			VITE_gitUser: gitUser,
			VITE_gitToken: gitToken,
			VITE_userMail: userMail,
		} = import.meta.env;
		const mailParam = userMail ? `-C ${userMail}` : "";
		const homeDir = BaseDirectory.Home;
		const sshDir = homeDir + "/.ssh";
		const keyNamePath = sshDir + "/git_generated" + keyName;
		//exec(`ssh-keygen -t rsa -b 4096 -f ${keyNamePath} ${mailParam} -q -N ""`,(err,stdout,stderr)=>{})
		const created = await Command.create("ssh-keygen", [
			"-q",
			"-t ed25519",
			'-N ""',
			`-f ${keyNamePath}`,
			mailParam,
		]).execute();
		//const created = await this.execShellCommandAsync(`ssh-keygen -q -t ed25519 -N "" -f ${keyNamePath} ${mailParam}`)
		//exec(`ssh-keygen -q -t ed25519 -N "" -f ${keyNamePath} ${mailParam}`)
		if (created) {
			const key = readFile(keyNamePath);
			const url = API_BASE_URL + `repos/${gitUser}/${repo}/keys`;
			const data = {
				title: keyName,
				key: key,
				read_only: true,
			};

			return fetch(url, {
				headers: {
					Accept: "application/vnd.github+json",
					Authorization: `Bearer ${gitToken}`,
					"X-GitHub-Api-Version": "2022-11-28",
				},
				body: JSON.stringify(data),
			}).then((res) => res.json());
		}
		return false;
	},
};

export default Github;
