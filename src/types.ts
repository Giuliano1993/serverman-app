interface RequestError extends Error {
	status?: number;
}

export type DeployInstance = {
	id: number;
	name?: string;
};

export interface Server extends DeployInstance {
	ip?: string;
}

export interface StaticSiteInstance extends DeployInstance {
	public_url?: string;
	admin_url?: string;
	repo?: string;
	preview_image_url?: string;
}

export interface NetlifySite extends StaticSiteInstance {}

export interface VercelProject extends StaticSiteInstance {
	name: string;
}

export interface Droplet extends Server {}

export interface HetznerServer extends Server {}

export type Repo = {
	branch: string;
	cmd: string;
	deploy_key_id: string;
	dir: string;
	private: boolean;
	provider: string;
	repo: string;
	repo_id: string | null;
	installation_id: string;
};

export type ApiHeaders = {
	"Content-Type": string;
	Authorization: string;
};

export type DODistribution = {};

export type SSHKey = {};

export type DOSize = {};

export type ProviderInterface = {
	API_BASE_URL: string;
	verifyConfig: boolean;
	buildBasicHeaders: () => ApiHeaders;
	convertServerToGeneric: (baseServer: any) => Server;
};

export interface DigitalOceanInterface extends ProviderInterface {
	createDroplet: (name: string, size: string, image: string) => Promise<any>;
	getDroplet: (dropletId: number | string) => Promise<Droplet | Error>;
	getDroplets: () => Promise<Droplet[] | Error>;
	getDistributions: (filter: string) => Promise<DODistribution | Error>;
	getSshKeys: () => Promise<SSHKey[]>;
	getSizes: () => Promise<DOSize | Error>;
}

export interface NetlifyInterface extends ProviderInterface {
	buildBasicHeaders: (contentType: string) => ApiHeaders;
	result_per_page: number;
	netlifyRequest: (
		url: string,
		body?: any,
		contentType?: string,
		method?: string,
	) => Promise<any>;
	listSites: () => ReturnType<typeof this.netlifyRequest>;
	getNetlifyDeployKey: () => ReturnType<typeof this.netlifyRequest>;
	deleteSite: (siteId: string) => ReturnType<typeof this.netlifyRequest>;
	createSite: (
		sitename: string,
		repo: string | null,
		repoId: string | null,
		command: string,
		buildDirectory: string,
		provider: string,
		keyName: string,
	) => ReturnType<typeof this.netlifyRequest>;
}

export interface VercelInterface extends ProviderInterface {
	projectList: () => any;
	deleteApp: (project: VercelProject) => any;
}

export interface AWSInterface extends ProviderInterface {}

export interface HetznerInterface extends ProviderInterface {
	serverList: () => Promise<Server[] | Error>;
}

export type GitHub = {
	repoList: () => Promise<any>;
	getDeployKey: (repo: string) => Promise<any>;
	createDeployKey: (repo: string, keyName: string) => Promise<any> | false;
};

export declare function createDroplet(
	name: string,
	size: string,
	image: string,
): Droplet | void;


export enum Provider {
	NETLIFY = "netlify",
	DIGITALOCEAN = "digitalocean",
	VERCEL = "vercel",
	AWS = "aws",
	HETZNER = "hetzner",
}