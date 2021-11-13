import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { NotFound } from "strapi-helper-plugin";
// Utils
import pluginId from "../../pluginId";
// Containers
import HomePage from "../HomePage";
import Emails from "../Emails";
import SideMenu from "../SideMenu";
import Wrapper from "./Wrapper";

const App = () => {
  return (
    <Wrapper>
      <SideMenu />
      <Switch>
        <Route path={`/plugins/${pluginId}/orders`} component={HomePage} />
        <Route path={`/plugins/${pluginId}/emails`} component={Emails} />
        <Route exact path={`/plugins/${pluginId}`}>
          <Redirect to={`/plugins/${pluginId}/orders`} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Wrapper>
  );
};

export default App;
