import DigitalOcean from "../providers/digitalOcean"
import Netlify from "../providers/netlify";
import Vercel from "../providers/vercel";
import Hetzner from "../providers/hetzner";
import { Provider } from "../types/types.ts";


export const getAvailableProviders = (): Provider[] => {

    const providers = [];
    if(DigitalOcean.verifyConfig) providers.push(Provider.DIGITALOCEAN);
    // if(AWS.verifyConfig) providers.push(Provider.AWS);
    if(Netlify.verifyConfig) providers.push(Provider.NETLIFY);
    if(Vercel.verifyConfig) providers.push(Provider.VERCEL);
    if(Hetzner.verifyConfig) providers.push(Provider.HETZNER);

    return providers;


}