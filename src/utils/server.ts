type installConfigurations = {
    webServerType : string,
    uploadRepo : boolean
    installPhp : boolean
    installGit : boolean
    installNode : boolean
    installComposer : boolean
    installDocker : boolean
    installMySql : boolean
    installCoolify : boolean
    installWebServer : boolean
    chosenRepo : any
}

const buildInstallServerScript  = (options:installConfigurations) : string[] => {
    const script: string[] = [];
    script.push("apt-get update")
    for (const optionsKey in options) {
        const value = options[optionsKey];

        if(value){
            switch(optionsKey){
                case "webServerType":
                    if(value === "apache"){
                        script.push("apt-get install -y apache2")
                    }
                    else if(value === "nginx"){
                        script.push("apt-get install -y nginx")
                    }
                    break;
                case "installPhp":
                    if(options.webServerType && options.webServerType === 'apache'){
                        script.push("apt-get install -y php libapache2-mod-php")
                        script.push( "systemctl restart apache2")
                    }else{
                        script.push("apt-get install -y php")
                    }
                    break;
                case "installGit":
                    script.push("apt-get install -y git")
                    break;
                case "installNode":
                    script.push("apt install -y nodejs")
                    script.push("apt install -y npm")
                    break;
                case "installComposer":
                    script.push("php -r \"copy('https://getcomposer.org/installer', 'composer-setup.php');\"")
                    script.push("php composer-setup.php --install-dir=/usr/local/bin --filename=composer")
                    script.push("php -r \"unlink('composer-setup.php');\"")
                    break;
                case "installDocker":
                    script.push("apt-get install ca-certificates curl");
                    script.push("install -m 0755 -d /etc/apt/keyrings")
                    script.push("curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc")
                    script.push("chmod a+r /etc/apt/keyrings/docker.asc")
                    script.push('echo \ "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \ $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \ sudo tee /etc/apt/sources.list.d/docker.list > /dev/null')
                    script.push("apt-get update")
                    script.push("apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin")
                    break;
                case "installMySql":
                    break;
                case "installCoolify":
                    script.push("curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash")
                    break;
            }
        }


    }
    return script;
}


export { buildInstallServerScript }