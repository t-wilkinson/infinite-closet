import { useGlobalContext } from "strapi-helper-plugin";

const usePlugin = () => {
  const context = useGlobalContext();
  const plugin = context.plugins.order;
  return plugin;
};
export default usePlugin;
