import appStore from "../store/app";

export default function useTranslations() {
  const { getTranslations } = appStore((state) => state);
  return getTranslations();
}
