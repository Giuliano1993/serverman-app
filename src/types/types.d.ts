export enum Provider {
    NETLIFY = 'netlify',
    DIGITALOCEAN = 'digitalocean',
    VERCEL = 'vercel',
    AWS = 'aws',

}

interface RequestError extends Error{
    status?: number
}


export type Server = {
    id: number,
    name?: string, 
    public_url?: string,
    admin_url?: string,
    ip?: string,
    repo?: string,
    preview_image_url?: string
}

export interface NetlifySite extends Server {

}

interface VercelProject extends Server{
    name: string
}

export interface Droplet extends Server{

}

type Repo = {
    "branch": string,
    "cmd": string,
    "deploy_key_id": string,
    "dir": string,
    "private": boolean,
    "provider": string,
    "repo": string,
    "repo_id": string|null,
    "installation_id": string
}

type ApiHeaders = {
    "Content-Type": string,
    "Authorization":string
}

type DODistribution = {}

type SSHKey = {}

type DOSize = {}


type ProviderInterface = {
    API_BASE_URL: string,
    buildBasicHeaders: ()=> ApiHeaders,
    convertServerToGeneric: (baseServer: any)=> Server
}


interface DigitalOceanInterface extends ProviderInterface {
    createDroplet: (name: string, size:string, image:string) => Promise<any>
    getDroplet: (dropletId: number|string)=>Promise<Droplet|Error>
    getDroplets: ()=>Promise<Droplet[]|Error>
    getDistributions: (filter: string)=>Promise<DODistribution|Error>
    getSshKeys: ()=>Promise<SSHKey[]>
    getSizes: ()=>Promise<DOSize|Error>

}


interface NetlifyInterface extends ProviderInterface {
    buildBasicHeaders: (contentType: string)=>ApiHeaders,
    netlifyRequest: (url: string, body?: any, contentType?: string, method?:string) =>Promise<any>,
    verifyNetlifyConfig: boolean,
    listSites: ()=>ReturnType<typeof this.netlifyRequest>,
    getNetlifyDeployKey: ()=>ReturnType<typeof this.netlifyRequest>,
    deleteSite: (siteId: string)=>ReturnType<typeof this.netlifyRequest>,
    createSite: (sitename: string, repo:string|null, repoId: string|null, command: string, buildDirectory:string, provider:string, keyName:string)=>ReturnType<typeof this.netlifyRequest>

}

interface VercelInterface extends ProviderInterface {
    projectList: ()=> any,
    deleteApp: (project: VercelProject) => any
}

interface AWSInterface extends ProviderInterface{
    
}

type GitHub = {
    repoList: ()=>Promise<any>,
    getDeployKey: (repo: string)=>Promise<any>,
    createDeployKey: (repo:string, keyName:string)=>Promise<any>|false,
}

export declare function createDroplet(name:string, size:string, image:string) : Droplet|void;
