import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
// when using `"withGlobalTauri": true`, you may use
// const { Client, Stronghold } = window.__TAURI__.stronghold;
import { appDataDir, homeDir } from '@tauri-apps/api/path';
// when using `"withGlobalTauri": true`, you may use
// const { appDataDir } = window.__TAURI__.path;

export const initStronghold = async () => {
  const vaultPath = `${await homeDir()}/vault.hold`;
  const vaultPassword = 'vault password';
  const stronghold = await Stronghold.load(vaultPath, vaultPassword);

  let client: Client;
  const clientName = 'name your client';
  try {
    client = await stronghold.loadClient(clientName);
  } catch {
    client = await stronghold.createClient(clientName);
  }

  return {
    stronghold,
    client,
  };
};

// Insert a record to the store
export async function insertRecord(store: any, key: string, value: string) {
  const data = Array.from(new TextEncoder().encode(value));
  await store.insert(key, data);
}

// Read a record from store
export async function getRecord(store: any, key: string): Promise<string> {
  const data = await store.get(key);
  return new TextDecoder().decode(new Uint8Array(data));
}


