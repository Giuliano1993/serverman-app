import { fetch } from '@tauri-apps/plugin-http';
import Github from '../gitProviders/github';
import { ApiHeaders, NetlifyInterface, Repo } from '../types/types';

const Netlify: NetlifyInterface = {
    API_BASE_URL: "https://api.netlify.com",
    verifyNetlifyConfig: import.meta.env.VITE_netlifyToken && import.meta.env.VITE_netlifyUser,
    buildBasicHeaders: (contentTYpe = "application/json")=>{
        const { VITE_netlifyToken : token } = import.meta.env
        return {
            'Content-Type':contentTYpe,
            'Authorization':'Bearer '+token
        } 
    },
    netlifyRequest: async function(url: string, body={}, contentType = "application/json",method = "POST"){
        const reqPars : {method: string, headers: ApiHeaders, body?: string} = {
            method,
            headers: this.buildBasicHeaders(contentType),
            //body: ''
        }
        if(method !== "GET"){
            reqPars['body'] = JSON.stringify(body);
        }
        return await fetch(this.API_BASE_URL + url, reqPars).then((res)=>{
            return new Promise((resolve,reject)=>{
                if(!res.ok){
                    reject(res)
                }else{
                    resolve(res.json())
                }

            })
            
        });
    },
    listSites: async function(){
        return await this.netlifyRequest("/api/v1/sites",{}, "application/json", "GET")
    },
    deleteSite: async function(siteId){
        return await this.netlifyRequest(`/api/v1/sites/${siteId}`,{},"application/json", "DELETE")
    },
    getNetlifyDeployKey: async function(){
        return await this.netlifyRequest("/api/v1/deploy_keys").then((res) => res['public_key']).catch((err)=>err);
    },
    createSite: async function(sitename, repo= null, repoId = null, command = "npm run build", buildDirectory = "dist/", provider = "github", keyName =""){
        if(!this.verifyNetlifyConfig){
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
                gitDeployKey = await Github.getDeployKey(repo)
                if(!gitDeployKey || Github.getDeployKey.length === 0){
                    console.log("No deploy key found for this repo. Creating one now.");
                    gitDeployKey = await Github.createDeployKey(repo, keyName)
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
    
            return this.netlifyRequest(`/api/v1/${netlifyUser}/sites`,payload).then((res)=>{
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
    
}

export default Netlify;