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


export const listSites = async ()=>{
    return await netlifyRequest("/api/v1/sites",{}, "application/json", "GET");

}