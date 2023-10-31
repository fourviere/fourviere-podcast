import { create } from "zustand";
import TRANSLATIONS from "../translations";

export enum View {
  START = "start",
}

export enum Language {
  EN = "en",
}

interface AppState {
  currentView: View;
  currentLanguage: Language;
  getTranslations: () => (typeof TRANSLATIONS)[Language];
}

const appStore = create<AppState>((_set, get) => {
  return {
    currentView: View.START,
    currentLanguage: Language.EN,
    getTranslations: () => {
      return TRANSLATIONS[get().currentLanguage];
    },
  };
});

export default appStore;
