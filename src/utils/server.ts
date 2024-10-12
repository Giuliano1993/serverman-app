import { fetch } from '@tauri-apps/plugin-http';
import { listSites as netlifySites } from '../providers/netlify';

export const listSites = async  (type: Provider)=>{
    switch (type) {
        case Provider.NETLIFY:
            return netlifySites();
            break;
        case Provider.DIGITALOCEAN:
            
            break;
        case Provider.VERCEL:
            
            break;
        case Provider.AWS:
        
            break;
        default:
            break;
    }
   
    
    
}