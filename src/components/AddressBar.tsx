import IconButton from "material-ui/IconButton";
import LinearProgress from "material-ui/LinearProgress";
import muiThemeable from "material-ui/styles/muiThemeable";
import {inject, observer} from "mobx-react";
import { RouterStore } from "mobx-react-router";
import * as React from "react";
import { Link } from "react-router-dom";

import { ResourceStore } from "../stores/resource";
import StackLayout from "./StackLayout";

interface IAddressBarProps {
    resource?: ResourceStore;
    routing?: RouterStore;
    muiTheme?: __MaterialUI.Styles.MuiTheme;
}

@inject("resource", "routing")
@observer
export class AddressBar extends React.Component<IAddressBarProps, {}> {
    private resourceStore: ResourceStore;
    private routing: RouterStore;
    private theme: __MaterialUI.Styles.MuiTheme;

    constructor(props: IAddressBarProps) {
        super(props);

        if (props.resource) {
            this.resourceStore = props.resource;
        }

        if (props.routing) {
            this.routing = props.routing;
        }

        if (props.muiTheme) {
            this.theme = props.muiTheme;
        }
    }

    public render() {
        return (
            <div style={{background: (this.theme.palette && this.theme.palette.primary1Color)}}>
                <StackLayout orientation="horizontal">
                    <Link to="/">
                        <IconButton iconClassName="material-icons">
                            arrow_back
                        </IconButton>
                    </Link>
                    <div style={{
                        alignSelf: "stretch",
                        borderLeft: "1.5px solid rgba(0, 0, 0, 0.5)",
                        margin: "10px 10px 10px 0"}}>
                    </div>
                    <input style={{
                            background: "none",
                            border: "none",
                            flex: 1,
                            fontFamily: "inherit",
                            fontSize: "1.1rem",
                            fontWeight: "normal",
                            outline: "none"}}
                        value={this.resourceStore.url}
                        autoFocus={!this.resourceStore.ready}
                        onChange={(e) => this.resourceStore.url = e.target.value}
                        onKeyPress={(e) => e.key === "Enter" ? this.go() : null} />
                    <IconButton iconClassName="material-icons"
                        disabled={!this.resourceStore.ready}
                        onTouchTap={this.toggleListen}>
                        {this.resourceStore.isListening ? "pause_circle_outline" : "play_circle_outline" }
                    </IconButton>
                </StackLayout>
                <LinearProgress mode="indeterminate"
                    color={
                        this.resourceStore.error
                            ? "#b71c1c"
                            : (this.theme.palette && this.theme.palette.accent2Color)
                    }
                    style={{
                        background: (this.theme.palette && this.theme.palette.primary1Color),
                        height: this.resourceStore.isListening ? "2px" : "0",
                        transition: "all 200ms ease-in-out",
                    }} />
            </div>
        );
    }

    private componentDidMount() {
        if (this.resourceStore.url) {
            this.resourceStore.start();
        }
    }

    private componentWillUnmount() {
        if (this.resourceStore.isListening) {
            this.resourceStore.stop();
        }
    }

    private toggleListen = () => {
        if (this.resourceStore.isListening) {
            this.resourceStore.stop();
        } else {
            this.resourceStore.start();
        }
    }

    private go = () => {
        if (this.resourceStore.ready) {{
            this.resourceStore.start();
        }}
    }
}

export default muiThemeable()(AddressBar);
