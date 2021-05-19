import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import App from "./containers/App";
import Initializer from "./containers/Initializer";
import lifecycles from "./lifecycles";
import trads from "./translations";

export default (strapi) => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;
  const icon = pluginPkg.strapi.icon;
  const name = "Order" || pluginPkg.strapi.name;

  const plugin = {
    stripe: {
      key:
        "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K",
      api: "https://api.stripe.com/v1",
    },
    hived: {
      key: "",
      api: "",
      sender: "Infinite Closet",
    },
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name,
    preventComponentRendering: false,
    trads,
    menu: {
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`,
          icon,
          label: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: name,
          },
          name,
          permissions: [
            // Uncomment to set the permissions of the plugin here
            // {
            //   action: '', // the action name should be plugins::plugin-name.actionType
            //   subject: null,
            // },
          ],
        },
      ],
    },
  };

  return strapi.registerPlugin(plugin);
};
