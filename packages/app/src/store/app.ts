import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { loadState, persistState } from "./persister";
import i18n from "../i18n";

const ERROR_TIMEOUT = 5000;

export interface AppState {
  //Translations
  locale: string;
  services: {
    podcastIndex: {
      enabled: boolean;
      apiKey?: string;
      apiSecret?: string;
    };
  };

  errors: {
    id: string;
    message: string;
  }[];
  //Configurations
  updateConfigurations: (configurations: AppState) => void;
  getConfigurations: (
    service: keyof AppState["services"],
  ) => AppState["services"][keyof AppState["services"]];
  addError: (error: string) => void;
}

const appStore = create<AppState>((set, get) => {
  return {
    locale: "en",
    services: {
      podcastIndex: {
        enabled: false,
        apiKey: "",
        apiSecret: "",
      },
    },
    errors: [],

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
      i18n.changeLanguage(state.locale);
    }
  })
  .catch((e) => {
    console.error("Error loading state", e);
  });

appStore.subscribe((state) => {
  void persistState<AppState>("app", state);
});

export default appStore;
