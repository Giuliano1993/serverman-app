const {NodeSSH}  = require('node-ssh');

const dropletId = process.argv[2];
const doToken = process.argv[3];
//const keyFingerprint = process.argv[4];
const localKeyFile = process.argv[4];


const sshInstall = (droplet)=>{
    console.log("Droplet ready")
    const {ip_address} = droplet.networks.v4.find(ip=>ip.type === "public");
    console.log("Droplet IP Address:", ip_address);
    const ssh = new NodeSSH();
    ssh.connect({
        host: ip_address,
        username: 'root',
        privateKeyPath: localKeyFile,
        tryKeyboard:true

    }).then(()=>{

            ssh.execCommand('whoami').then((result) => {
                console.log(`STDOUT: ${result.stdout}`)
                console.log(`STDERR: ${result.stderr}`)
            })
            ssh.execCommand('apt-get update')
                .then((res)=>{
                    console.log(res.stdout)
                    return ssh.execCommand("apt-get install -y apache2")}
                )
                .then((res)=>{
                    console.log(res.stdout)
                    return ssh.execCommand("apt-get install -y php libapache2-mod-php")
                })
                .then((res)=>{
                    console.log(res.stdout)
                    return ssh.execCommand("systemctl restart apache2")
                })
                .then((res)=>{
                    console.log(res.stdout)
                    return ssh.execCommand("php -r \"copy('https://getcomposer.org/installer', 'composer-setup.php');\"")
                })
                .then((res)=>{
                    console.log(res.stdout)
                    return ssh.execCommand("php composer-setup.php --install-dir=/usr/local/bin --filename=composer")
                })
                .then((res)=>{
                    console.log(res.stdout)
                    return ssh.execCommand("php -r \"unlink('composer-setup.php');\"")
                })
                .then((res)=>{
                    console.log(res.stdout)
                    return ssh.execCommand("apt-get install -y git")
                })
                .then((res)=>{
                    process.exit(0)
                })
        
    }).catch((error)=>{
        console.log(error)
        return ssh.connect({
            host: ip_address,
            username: 'root',
            privateKeyPath: process.env.localKeyFile,
            tryKeyboard:true
    
        })
    }).then(()=>{
        ssh.execCommand('ls').then((result) => {
            console.log(`STDOUT: ${result.stdout}`)
            console.log(`STDERR: ${result.stderr}`)
        })
    })
}

const getDroplet = async (dropletId) => {
        const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${doToken}`,
		};
        console.log("Fetching droplet with ID:", dropletId);
        const url = `https://api.digitalocean.com/v2/droplets/${dropletId}`;
        const droplet= await fetch(url, {
            headers: headers,
        })
            .then((res) => res.json())
            .then((res) => res.droplet)
            .catch((err) => {
                console.error("Error fetching droplet:", err);
                throw err;
            });
        return droplet;
}

getDroplet(dropletId).then(droplet => {
    console.log("Droplet fetched:", droplet);
    
    sshInstall(droplet);
}).catch(error => {
    console.error("Error during droplet installation:", error);
});