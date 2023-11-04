import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import TRANSLATIONS from "../translations";
import { loadState, persistState } from "./persister";

export enum View {
  START = "start",
}

export enum Language {
  EN = "en",
}

const ERROR_TIMEOUT = 5000;

interface AppState {
  currentView: View;

  //Translations
  currentLanguage: Language;
  getTranslations: () => (typeof TRANSLATIONS)[Language];

  //Configurations
  configurations: {
    services: {
      podcastIndex: {
        enabled: boolean;
        apiKey?: string;
        apiSecret?: string;
      };
    };
  };
  getConfigurations: (
    service: keyof AppState["configurations"]["services"]
  ) => AppState["configurations"]["services"][keyof AppState["configurations"]["services"]];

  //Error system
  errors: {
    id: string;
    message: string;
  }[];
  addError: (error: string) => void;
}

const appStore = create<AppState>((set, get) => {
  return {
    currentView: View.START,
    // Translations
    currentLanguage: Language.EN,
    getTranslations: () => {
      return TRANSLATIONS[get().currentLanguage];
    },

    // Error system
    errors: [],
    addError: (error) => {
      const e = { message: error, id: uuidv4() };
      set((state) => ({ errors: [...state.errors, e] }));
      setTimeout(() => {
        set((state) => ({
          errors: state.errors.filter((e) => e.id !== e.id),
        }));
      }, ERROR_TIMEOUT);
    },

    // Configurations
    configurations: {
      services: {
        podcastIndex: {
          enabled: false,
        },
      },
    },
    getConfigurations: (service) => {
      return get().configurations.services?.[service];
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
