import { fetch } from "@tauri-apps/plugin-http";


export const projectList = async ()=>{
    const {VITE_vercelToken: vercelToken} = import.meta.env;
    const sites = await fetch("https://api.vercel.com/v9/projects", {
      "headers": {
        "Authorization": `Bearer ${vercelToken}`
      },
      "method": "get"
    }).then(response => response.json())
    .then(data => {
      return data.projects
    }) 
    
    return sites
}


export const deleteApp = async (project: VercelProject)=>{
    const {VITE_vercelToken: vercelToken} = import.meta.env;

    await fetch(`https://api.vercel.com/v9/projects/${project.id}`, {
        "headers": {
          "Authorization": `Bearer ${vercelToken}`
        },
        "method": "delete"
      }).then((response) => { if(response.status === 204){
        return true
      }}).catch((err)=>{
        return false
      })
} 