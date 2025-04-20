const { NodeSSH } = require('node-ssh');

const dropletId = process.argv0[2];
const doToken = process.argv0[3];
//const keyFingerprint = process.argv0[4];
const localKeyFile = process.argv0[4];


const sshInstall = (droplet)=>{
    console.log("Droplet ready")
    const {ip_address} = droplet.networks.v4.find(ip=>ip.type === "public");
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

        const commands = [
            "apt-get update",
            "apt-get install -y apache2",
            "apt-get install -y php libapache2-mod-php",
            "systemctl restart apache2",
            "php -r \"copy('https://getcomposer.org/installer', 'composer-setup.php');\"",
            "php composer-setup.php --install-dir=/usr/local/bin --filename=composer",
            "php -r \"unlink('composer-setup.php');\"",
            "apt-get install -y git",
        ]
        //ssh.execCommand
        
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
    sshInstall(droplet);
}).catch(error => {
    console.error("Error during droplet installation:", error);
});