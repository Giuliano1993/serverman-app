enum Provider {
    NETLIFY = 'netlify',
    DIGITALOCEAN = 'digitalocean',
    VERCEL = 'vercel',
    AWS = 'aws',

}

interface RequestError extends Error{
    status?: number
}


type Server = {
    id: number
}

interface NetlifySite extends Server {

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


type ProviderInterface = {
    API_BASE_URL: string,
    buildBasicHeaders: ()=> ApiHeaders
}

type DODistribution = {}

type SSHKey = {}

type DOSize = {}

interface DigitalOceanInterface extends ProviderInterface {
    createDroplet: (name: string, size:string, image:string) => Promise<any>
    getDroplet: (dropletId: number|string)=>Promise<Droplet|Error>
    getDroplets: ()=>Promise<Droplet[]|Error>
    getDistributions: (filter: string)=>Promise<DODistribution|Error>
    getSshKeys: ()=>Promise<SSHKey[]>
    getSizes: ()=>Promise<DOSize|Error>

}


interface NetlifyInterface extends ProviderInterface {

}

interface VercelInterface extends ProviderInterface {
    
}

interface AWSInterface extends ProviderInterface{
    
}

export declare function createDroplet(name:string, size:string, image:string) : Droplet|void;
