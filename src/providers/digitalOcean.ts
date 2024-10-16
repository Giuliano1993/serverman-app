const buildBasicHeaders = ()=>{
    const token = process.env.doAuthToken;
    return {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+token
    }   
}

export const createDroplet = async (name, size, image)=>{
    configDotenv({path: __dirname + '/../../.env'});
    const headers = buildBasicHeaders();
    const createDropletUrl = API_BASE_URL + "droplets";
    const sshKeys = [process.env.sshKey]

    const data = {
        "name":name,
        "size":size,
        "image":parseInt(image),
        "ssh_keys": sshKeys
    }
    return await fetch(createDropletUrl,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then((res)=>res.droplet)
    .catch((err)=>{
        console.log(err)
    })
}


export const getDroplet = async (dropletId)=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + `droplets/${dropletId}`;
    return await fetch(url,{
        headers: headers
    })
    .then(res=>res.json())
    .then(res=>res['droplet'])
}

export const getDroplets = ()=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + `droplets?page=1`;
    return fetch(url,{
        headers: headers
    })
    .then(res=>res.json())
    .then((res)=>res['droplets'])
    .catch((err=>{
        console.log(err)
    }))
}

export const getDistributions = async (filter="")=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + `images?type=distribution`
    return await fetch(url, {
        headers:headers
    }).then(res=>res.json())
    .then(res=>res['images'])
    .then((res)=>{
        const distros = res.filter((distro)=>distro['status'] === "available")
        if(filter === "") return distros;
        return distros.filter((distro)=>distro['title'].includes(filter))
    })
}
export const getSshKeys= async ()=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + "account/keys";
    return await fetch(url,{
        headers:headers
    }).then(res=>res.json())
    .then(res=>res['ssh_keys'])
}

export const getSizes = async ()=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + "sizes";
    return await fetch(url,{
        headers:headers
    }).then(res=>res.json())
    .then(res=>res['sizes'])
    
}