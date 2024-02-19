import appStore from "../store/app";

export default function UseConfigurations() {
  const state = appStore((state) => state);

  return {
    configurations: state,
    update: state.updateConfigurations,
  };
}
