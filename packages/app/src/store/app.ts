import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import TRANSLATIONS from "../translations";
import { loadState, persistState } from "./persister";

export enum View {
  START = "start",
}

const Language = {
  en: "en",
  fr: "fr",
  de: "de",
  es: "es",
  it: "it",
} as const;

const ERROR_TIMEOUT = 5000;

export interface AppState {
  //Translations
  locale: keyof typeof TRANSLATIONS;
  services: {
    podcastIndex: {
      enabled: boolean;
      apiKey?: string;
      apiSecret?: string;
    };
  };
  getTranslations: () => (typeof TRANSLATIONS)[keyof typeof TRANSLATIONS];

  //Configurations

  updateConfigurations: (configurations: AppState) => void;

  getConfigurations: (
    service: keyof AppState["services"],
  ) => AppState["services"][keyof AppState["services"]];

  //Error system
  errors: {
    id: string;
    message: string;
  }[];
  addError: (error: string) => void;
}

const appStore = create<AppState>((set, get) => {
  return {
    locale: Language.en,
    services: {
      podcastIndex: {
        enabled: false,
      },
    },
    errors: [],

    getTranslations: () => {
      return TRANSLATIONS[get().locale];
    },
    // Error system
    addError: (error) => {
      const e = { message: error, id: uuidv4() };
      set((state) => ({ errors: [...state.errors, e] }));
      setTimeout(() => {
        set((state) => ({
          errors: state.errors.filter((e) => e.id !== e.id),
        }));
      }, ERROR_TIMEOUT);
    },

    updateConfigurations: (configurations) => {
      set((state) => ({
        ...state,
        ...configurations,
      }));
    },

    getConfigurations: (service) => {
      return get().services?.[service];
    },
  };
});

loadState<AppState>("app")
  .then((state) => {
    if (state) {
      appStore.setState(state);
    }
  })
  .catch((e) => {
    console.error("Error loading state", e);
  });

appStore.subscribe((state) => {
  void persistState<AppState>("app", state);
});

export default appStore;
