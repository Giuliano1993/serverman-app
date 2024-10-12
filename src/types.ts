enum Provider {
    NETLIFY = 'netlify',
    DIGITALOCEAN = 'digitalocean',
    VERCEL = 'vercel',
    AWS = 'aws',

}

interface RequestError extends Error{
    status?: number
}