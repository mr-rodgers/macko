import "core-js/es6";
import "./scss/styles.scss";

import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import Landing from "./components/Landing";
import { ReleasesStore } from "./stores/releases";

const stores = {
    releases: new ReleasesStore("te-je/macko"),
};

ReactDOM.render(
    <Provider {...stores}>
        <Router>
            <Switch>
                <Route exact path="/" component={Landing}/>
            </Switch>
        </Router>
    </Provider>,
    document.getElementById("root"),
);
