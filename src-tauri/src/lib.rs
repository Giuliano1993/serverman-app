use tauri::Manager;
use ssh2::Session;
use std::{net::TcpStream};
use std::io::Read;
use std::net::ToSocketAddrs;

#[tauri::command]
fn exec_ssh_commands(ip: String, command: String) -> String {
    // Connect to the SSH server
    let address = (ip.clone(), 22).to_socket_addrs().unwrap().next().unwrap();
    let tcp = TcpStream::connect(address).unwrap();
    let mut sess = Session::new().unwrap();
    sess.set_tcp_stream(tcp);
    sess.handshake().unwrap();

    // Authenticate with the first identity in the agent
    sess.userauth_agent("root").unwrap();

    // Ensure authentication succeeded
    if !sess.authenticated() {
        return format!("Failed to authenticate to {}", ip);
    }

    // Open a channel and execute the command
    let mut channel = sess.channel_session().unwrap();
    channel.exec(&command).unwrap();

    // Read the output of the command
    let mut output = String::new();
    
    channel.read_to_string(&mut output).unwrap();

    // Close the channel and return the output
    channel.wait_close().unwrap();
    let exit_status = channel.exit_status().unwrap();

    format!("Command executed with exit status {}: {}", exit_status, output)
}


#[tauri::command]
fn run_node_ssh_install(dropletid: String, dotoken: String, path: String) -> String{
    let output = std::process::Command::new("node")
        .arg("./src/sshInstall.cjs")
        .arg(dropletid)
        .arg(dotoken)
        .arg(path)
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        
        String::from_utf8_lossy(&output.stdout).to_string()
    } else {
        String::from_utf8_lossy(&output.stderr).to_string()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_stronghold::Builder::new(|password| {
            use argon2::{hash_raw, Config, Variant, Version};

            let config = Config {
                lanes: 2,
                mem_cost: 1_000,
                time_cost: 5,
                variant: Variant::Argon2id,
                version: Version::Version13,
                ..Default::default()
            };

            let salt = "your-salt".as_bytes();

            let key = hash_raw(password.as_ref(), salt, &config).expect("failed to hash password");

            key.to_vec()

        }).build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
            .setup(|app| {
                let salt_path = app
                    .path()
                    .home_dir()
                    .expect("could not resolve app local data path")
                    .join("salt.txt");
                app.handle().plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
                Ok(())
            })
        .invoke_handler(tauri::generate_handler![exec_ssh_commands, run_node_ssh_install])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
