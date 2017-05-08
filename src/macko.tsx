import createBrowserHistory from "history/createBrowserHistory";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { autorun } from "mobx";
import { Provider } from "mobx-react";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Router, Switch } from "react-router";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import Resource from "./components/Resource";
import Welcome from "./components/Welcome";
import { IProtocolHandler, PluginStore } from "./stores/plugins";
import { ResourceStore } from "./stores/resource";
import { SettingsStore } from "./stores/settings";

injectTapEventPlugin();
const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const pluginStore = new PluginStore("plugins");
const settingsStore = new SettingsStore();
const resourceStore = new ResourceStore(settingsStore);


const muiTheme = getMuiTheme({
    fontFamily: "'Open Sans', sans-serif",
    palette: {
        accent1Color: "#ffd600",
        accent2Color: "#f57f17",
        primary1Color: "#fff176",
    },
});

const stores = {
  // Key can be whatever you want
  plugins: pluginStore,
  resource: resourceStore,
  routing: routingStore,
  settings: settingsStore,
};

const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider {...stores}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/resource" component={Resource} />
                    <Route component={Welcome}/>
                </Switch>
            </Router>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById("root"),
);

// On new ProtocolHandlers, ensure that the resource store has
// a handler set.
autorun(() => {
    // Get a list of all the available protocol handlers
    // from the plugin store
    const protocolHandlers = pluginStore.protocolHandlers;

    if (!resourceStore.handler) {
        // Get the last one from the settings if it has been set
        if (settingsStore.handlerID) {
            const handler = protocolHandlers.find((h) => h.__macko_impl_id__ === settingsStore.handlerID);

            if (handler) {
                resourceStore.handler = handler;
                return;
            }
        }

        // If no handler has been set in the settings (or the handler from the settings
        // is no longer available), literally grab the first handler and set that
        if (protocolHandlers.length) {
            resourceStore.handler = protocolHandlers[0];
        }
    }
});
