import DigitalOcean from "../providers/digitalOcean"
import Netlify from "../providers/netlify";
import Vercel from "../providers/vercel";
import Hetzner from "../providers/hetzner";
import type { Provider } from "../types";


export const getAvailableProviders = (): Provider[] => {

    const providers = [];
    if(DigitalOcean.verifyConfig) providers.push("digitalocean");
    // if(AWS.verifyConfig) providers.push(Provider.AWS);
    if(Netlify.verifyConfig) providers.push("netlify");
    if(Vercel.verifyConfig) providers.push("vercel");
    if(Hetzner.verifyConfig) providers.push("hetzner");

    return providers;


}