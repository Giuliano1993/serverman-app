import { fetch } from '@tauri-apps/plugin-http';

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

export const createSite = (sitename: string, repo:string|null = null, repoId: string|null = null, command: string = "npm run build", buildDirectory = "dist/", provider = "github")=>{

}
