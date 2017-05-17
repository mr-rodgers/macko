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

import Documentation from "./components/Documentation";
import Landing from "./components/Landing";
import { ReleasesStore } from "./stores/releases";

const stores = {
    releases: new ReleasesStore("te-je/macko"),
};

ReactDOM.render(
    <Provider {...stores}>
        <Router basename="/macko">
            <Switch>
                <Route exact path="/" component={Landing}/>
                <Route path="/docs" component={Documentation} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById("root"),
);
