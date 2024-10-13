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