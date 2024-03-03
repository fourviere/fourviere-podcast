import { Store } from "@tauri-apps/plugin-store";
import { Project } from "./feed/types";
import { AppState } from "./app";
import { invoke } from "@tauri-apps/api/tauri";

export async function persistState<T>(store: string, state: T) {
  try {
    const value = await maybe_obfuscate(store, state);
    const storeFile = new Store(`${store}.dat`);
    await storeFile.set(store, value);
    await storeFile.save();
  } catch (e) {
    console.log("persistState error", e);
  }
}

export async function loadState<T>(store: string) {
  try {
    const storeFile = new Store(`${store}.dat`);
    const value = (await storeFile.get(store)) as T;

    // Project handling
    if (hasConfiguration(value)) {
      if (value.configuration.remotes.ftp) {
        value.configuration.remotes.ftp.password = await invoke<string>(
          "get_secret",
          { name: value.configuration.remotes.ftp.password },
        );
      }
      if (value.configuration.remotes.s3) {
        value.configuration.remotes.s3.secret_key = await invoke<string>(
          "get_secret",
          { name: value.configuration.remotes.s3.secret_key },
        );
      }
    }
    // AppState handling
    if (hasServices(value)) {
      value.services.podcastIndex.apiSecret = await invoke<string>(
        "get_secret",
        { name: value.services.podcastIndex.apiSecret },
      );
    }
    return value;
  } catch (e) {
    console.log("loadState error", e);
  }
}

async function maybe_obfuscate<T>(id: string, state: T): Promise<T> {
  // Create a RW copy
  const value = JSON.parse(JSON.stringify(state)) as T;
  if (hasConfiguration(value)) {
    if (value.configuration.remotes.ftp) {
      const key = `${id}.ftp.password`;
      await invoke<string>("set_secret", {
        name: key,
        value: value.configuration.remotes.ftp.password,
      });
      value.configuration.remotes.ftp.password = key;
    }
    if (value.configuration.remotes.s3) {
      const key = `${id}.s3.secret_key`;
      await invoke<string>("set_secret", {
        name: key,
        value: value.configuration.remotes.s3.secret_key,
      });
      value.configuration.remotes.s3.secret_key = key;
    }
  }
  if (hasServices(value)) {
    if (value.services.podcastIndex.apiSecret) {
      const key = `${id}.podcastIndex.apiSecret`;
      await invoke<string>("set_secret", {
        name: key,
        value: value.services.podcastIndex.apiSecret,
      });
      value.services.podcastIndex.apiSecret = key;
    }
  }
  return value;
}

function hasConfiguration(state: unknown): state is Project {
  return (
    typeof state === "object" && (state as Project).configuration !== undefined
  );
}

function hasServices(state: unknown): state is AppState {
  return (
    typeof state === "object" && (state as AppState).services !== undefined
  );
}
