import { create } from "zustand";
import TRANSLATIONS from "../translations";
import { loadState, persistState } from "./persister";

export enum View {
  START = "start",
}

export enum Language {
  EN = "en",
}

interface AppState {
  currentView: View;
  currentLanguage: Language;
  configurations: {
    services: {
      podcastIndex: {
        enabled: boolean;
        apiKey?: string;
        apiSecret?: string;
      };
    };
  };
  getTranslations: () => (typeof TRANSLATIONS)[Language];
  getConfigurations: (
    service: keyof AppState["configurations"]["services"]
  ) => AppState["configurations"]["services"][keyof AppState["configurations"]["services"]];
}

const appStore = create<AppState>((_set, get) => {
  return {
    currentView: View.START,
    currentLanguage: Language.EN,
    getTranslations: () => {
      return TRANSLATIONS[get().currentLanguage];
    },
    getConfigurations: (service) => {
      return get().configurations.services?.[service];
    },
    configurations: {
      services: {
        podcastIndex: {
          enabled: false,
        },
      },
    },
  };
});

loadState<AppState>("app").then((state) => {
  if (state) {
    appStore.setState(state);
  }
});

appStore.subscribe(async (state) => {
  await persistState<AppState>("app", state);
});

export default appStore;
