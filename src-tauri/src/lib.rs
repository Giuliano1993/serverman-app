use tauri::Manager;
use ssh2::Session;
use std::net::TcpStream;




#[tauri::command]
fn exec_ssh_commands(ip: String) -> String {
    // Connect to the local SSH server
    let tcp = TcpStream::connect(ip).unwrap();
    let mut sess = Session::new().unwrap();
    sess.set_tcp_stream(tcp);
    sess.handshake().unwrap();

    // Try to authenticate with the first identity in the agent.
    sess.userauth_agent("root").unwrap();

    // Make sure we succeeded
    assert!(sess.authenticated());

    format!("Yay got it")
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
        .invoke_handler(tauri::generate_handler![exec_ssh_commands])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
