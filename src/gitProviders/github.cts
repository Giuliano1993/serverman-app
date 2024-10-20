import { fetch } from '@tauri-apps/plugin-http';
import { GitHub } from '../types/types';
const os = require('os')
const fs = require('node:fs')
const {exec} = require('child_process')
const API_BASE_URL = "https://api.github.com/";


const Github: GitHub = {
    repoList: async function(){
        const {VITE_gitUser: gitUser, VITE_gitToken: gitToken} = import.meta.env
        const url = API_BASE_URL + `users/${gitUser}/repos?per_page=100`;
        return await fetch(url,{
            headers: {
                "Accept":"application/vnd.github+json",
                "Authorization": `Bearer ${gitToken}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }).then(res=>res.json());
    },
    getDeployKey: async function(repo ){
        const {VITE_gitUser: gitUser, VITE_gitToken: gitToken} = import.meta.env;
        const url = API_BASE_URL + `repos/${gitUser}/${repo}/keys`;
        console.log(url)
        return await fetch(url,{
            headers: {
                "Accept":"application/vnd.github+json",
                "Authorization": `Bearer ${gitToken}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }).then(res=>res.json())
    },
    createDeployKey: async function(repo, keyName){
        const {VITE_gitUser: gitUser,VITE_gitToken: gitToken, VITE_userMail:userMail} = import.meta.env;
        const mailParam = userMail ? `-C ${userMail}` : "";
        const homeDir = os.homedir();
        const sshDir = homeDir + "/.ssh";
        const keyNamePath = sshDir + "/git_generated" + keyName;
        //exec(`ssh-keygen -t rsa -b 4096 -f ${keyNamePath} ${mailParam} -q -N ""`,(err,stdout,stderr)=>{})
        const created = await this.execShellCommandAsync(`ssh-keygen -q -t ed25519 -N "" -f ${keyNamePath} ${mailParam}`)
        //exec(`ssh-keygen -q -t ed25519 -N "" -f ${keyNamePath} ${mailParam}`)
        if(created){
            let key;
            fs.readFileSync(keyNamePath, 'utf8', (err: Error, data:string) => {
                if (err) throw err;
                key = data;
            })
            const url = API_BASE_URL + `repos/${gitUser}/${repo}/keys`;
            const data = {
                title: keyName,
                key: key,
                read_only: true
            }
    
            return fetch(url,{
                headers:{
                    "Accept":"application/vnd.github+json",
                    "Authorization": `Bearer ${gitToken}`,
                    "X-GitHub-Api-Version": "2022-11-28"
                },
                body: JSON.stringify(data)
            }).then(res=>res.json())
        }
        return false
    
    },
    execShellCommandAsync: function(cmd: string) {
        return new Promise((resolve, reject) => {
         exec(cmd, (error: string, stdout:string, stderr:string) => {
          if (error) {
           console.warn(error);
          }
          resolve(stdout? stdout : stderr);
         });
        });
       }

}

export default Github