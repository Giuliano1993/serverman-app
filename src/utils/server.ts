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

const buildInstallServerScript : string = (options:installConfigurations)=>{
    let script = "";

    for (const optionsKey in options) {
        const value = options[optionsKey];
    }
    return script;
}