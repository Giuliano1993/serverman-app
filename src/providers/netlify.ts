import { fetch } from '@tauri-apps/plugin-http';
import { createDeployKey, getDeployKey, repoList as gitHubRepoList } from '../gitProviders/github';

const netlifyRequest = async (url: string, body={}, contentType = "application/json",method = "POST")=>{
    const {VITE_netlifyToken: netlifyToken, VITE_netlifyUser: netlifyUser} = import.meta.env;
    const netlifyAPI = "https://api.netlify.com";

    const reqPars = {
        method,
        headers: {
            "Authorization": `Bearer ${netlifyToken}`,
            "Content-Type": contentType
        },
        body: ''
    }
    if(method !== "GET"){
        reqPars['body'] = JSON.stringify(body);
    }

    // here need to be added control on the response status
    return await fetch(netlifyAPI + url, reqPars).then((res)=>{
        if(!res.ok){
            //console.log(res.status, res.statusText)
            const err: RequestError = new Error(res.statusText);
            err.status = res.status;
            throw err;
        }
        return res.json()
        
    });   
}


export const listSites = async () => await netlifyRequest("/api/v1/sites",{}, "application/json", "GET");

export const deleteSite = async(siteId: number) => await netlifyRequest(`/api/v1/sites/${siteId}`,{},"application/json", "DELETE")

export const getNetlifyDeployKey = async () => await netlifyRequest("/api/v1/deploy_keys").then((res) => res['public_key']);

// temporary for getting the project started, kesy won't stay in .env in released mode
export const verifyNetlifyConfig = ()=> import.meta.env.VITE_netlifyToken && import.meta.env.VITE_netlifyUser;

export const createSite = async (sitename: string, repo:string|null = null, repoId: string|null = null, command: string = "npm run build", buildDirectory = "dist/", provider = "github", keyName ="")=>{
    if(!verifyNetlifyConfig()){
        console.log("You need to set your Netlify Token and Netlify username first");
        // throw error, manage it on FE opening a modal
        //process.exit(0);
    }

    const { VITE_githubInstallationId: githubInstallationId, VITE_netlifyUser: netlifyUser } = import.meta.env
    
    let payload : {name: string, subdomain:string, repo: null|Repo, build_settings: null|Repo}= {
        "name":sitename,
        "subdomain":sitename,
        "repo":null,
        "build_settings":null
    }

    if(repo != null){
        let gitDeployKey
        try {
            gitDeployKey = await getDeployKey(repo)
            if(!gitDeployKey || getDeployKey.length === 0){
                console.log("No deploy key found for this repo. Creating one now.");
                gitDeployKey = await createDeployKey(repo, keyName)
            }else{
                gitDeployKey = gitDeployKey[0]
            }
        } catch (error: any) {
            if(error.status && error.status === 401){
                console.log("Wrong credentials for Netlify or Github. Please update them in your configuration");
                //redirect errro to frontend to take care and save configs
                //await setConfigurationAsync(["netlifyToken","netlifyUser","gitToken","gitUser","githubInstallationId"]);
            }
        }

        payload['repo'] = {
            "branch": "main",
            "cmd": command,
            "deploy_key_id": gitDeployKey['id'],
            "dir": "dist/",
            "private": false,
            "provider": "github",
            "repo": repo,
            "repo_id": repoId,
            "installation_id": githubInstallationId
        }
        payload["build_settings"] = payload['repo']

        netlifyRequest(`/api/v1/${netlifyUser}/sites`,payload).then((res)=>{
            console.log("Site created")
            //return success message to the fonrtend
            return res
        }).catch((err)=>{
            console.log("Error creating site");
            console.log(err);

            //return error message to the frontend
        })

    }
}

export type SiteCreated = Awaited<ReturnType<typeof createSite>>
