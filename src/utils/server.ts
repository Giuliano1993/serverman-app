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

const buildInstallServerScript : string[] = (options:installConfigurations)=>{
    let script: string[] = [];
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
                    break;
                case "installNode":
                    break;
                case "installComposer":
                    break;
                case "installDocker":
                    break;
                case "installMySql":
                    break;
                case "installCoolify":
                    break;
            }
        }


    }
    return script;
}