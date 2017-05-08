// tslint:disable-next-line:no-var-requires // no typings
const DropDownMenu: any = require("material-ui/DropDownMenu").DropDownMenu;
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import {inject, observer} from "mobx-react";
import { RouterStore } from "mobx-react-router";
import * as React from "react";
import {v4 as uuid4} from "uuid";

import { Implementation } from "../stores/plugins";
import { IProtocolHandler, PluginStore } from "../stores/plugins";
import { ResourceStore } from "../stores/resource";
import { SettingsStore } from "../stores/settings";
import StackLayout from "./StackLayout";

interface IUrlInputState {
    inputId: string;
    inputFocused: boolean;
}

interface IUrlInputProps {
    settings?: SettingsStore;
    plugins?: PluginStore;
    resource?: ResourceStore;
    routing?: RouterStore;
}

@inject("settings", "resource", "plugins", "routing")
@observer
export default class UrlInput extends React.Component<IUrlInputProps, IUrlInputState> {
    private input: HTMLInputElement;

    constructor(props: IUrlInputProps) {
        super(props);
        this.state = {
            inputFocused: true,
            inputId: "",
        };
    }

    get styles() {
        return {
            button: {
                background: "#ffeb3b",
                borderRadius: "22px",
                cursor: "pointer",
                display: "inline-block",
                height: "24px",
                margin: "-10px",
                overflow: "visible" as "visible",
                padding: "10px",
            },
            header: {
                fontSize: "inherit",
                fontWeight: 300 as 300,
                textAlign: "center",
            },
            input: {
                background: "#fffde7",
                border: "none",
                flex: 1,
                fontFamily: "inherit",
                fontSize: "inherit",
                marginLeft: "2px",
                outline: this.state.inputFocused ? "2px dashed #ffd600" : "none",
                outlineOffset: "0",
                transition: "all 0.1s ease-out",
            },
            inputField: {
                height: "34px",
                position: "relative" as "relative",
            },
            largeText: {
                fontSize: "1.3rem",
            },
            lighter: {
                opacity: 0.8,
            },
            paragraph: {
                fontWeight: 300 as 300,
                textAlign: "center",
            },
            protoLabel: {
                fontSize: "inherit",
                opacity: 0.5,
            },
        };
    }

    public render() {
        if (!this.props.resource) {
            return null;
        }

        if (!this.props.resource.handler) {
            return (
                <StackLayout contentAlignment="center" contentFill="center">
                    <h1 style={{...this.styles.header, ...this.styles.largeText}}>Something went wrong 😞</h1>
                    <p style={this.styles.paragraph}>
                        Macko can't function correctly right now.
                        If this keeps happening, try re-installing Macko.
                    </p>
                    <p style={this.styles.paragraph}>
                        <span style={this.styles.lighter}>E_NO_PROTOCOL_HANDLER_PLUGINS_FOUND</span>
                    </p>
                </StackLayout>
            );
        }

        const handler = this.props.resource.handler;
        let proto;
        try {
            proto = new URL(this.props.resource.url || "").protocol + "//";
        } catch (e) {
            proto = handler.protocol;
        }
        let urlBody = this.props.resource.url || "";

        if (urlBody.startsWith(proto)) {
            urlBody = urlBody.slice(proto.length);
        }

        return (
            <StackLayout contentAlignment="center" contentFill="stretch">
                <form style={this.styles.largeText} onSubmit={this.handleSubmit}>
                    <h1 style={this.styles.header}>Watch a { this.renderHandlerMenu() } @</h1>
                    <div style={this.styles.inputField}>
                        <StackLayout orientation="horizontal" contentAlignment="center" contentFill="baseline">
                            <label htmlFor={this.state.inputId}
                                style={this.styles.protoLabel}>{proto}</label>
                            <input id={this.state.inputId}
                                style={this.styles.input} placeholder="watchable-resource.example.org"
                                value={urlBody}
                                onChange={this.updateUrl}
                                onFocus={() => this.setState({inputFocused: true})}
                                onBlur={() => this.setState({inputFocused: false})}
                                ref={(i) => this.input = i}
                                autoFocus
                            />
                        </StackLayout>
                    </div>
                    <input type="hidden" />
                </form>
                <StackLayout.Panel fill="center">
                    <IconButton iconClassName="material-icons"
                        disabled={!this.props.resource.ready}
                        onTouchTap={this.watchResource}
                        iconStyle={this.styles.button}
                        style={{width: "64px", height: "64px"}}>arrow_forward</IconButton>
                </StackLayout.Panel>
            </StackLayout>
        );
    }

    private renderHandlerMenu() {
        if (!this.props.plugins || !this.props.resource) {
            return null;
        }

        const handlers = this.props.plugins.protocolHandlers;
        const curHandler = this.props.resource.handler as Implementation<IProtocolHandler>;

        return (
            <DropDownMenu value={curHandler.__macko_impl_id__}
                onChange={this.updateProtocolHandler}
                labelStyle={this.styles.largeText}
                menuItemStyle={this.styles.largeText}
                style={{verticalAlign: "-20px"}}>
                {
                    handlers.map((h, i) => <MenuItem value={h.__macko_impl_id__} key={i} primaryText={h.name} />)
                }
            </DropDownMenu>
        );
    }

    private componentWillMount() {
        const inputId = uuid4();
        this.setState({inputId});
    }

    private handleSubmit = (e: any) => {
        e.preventDefault();
        this.watchResource();
    }

    private watchResource = () => {
        if (!this.props.resource || !this.props.resource.handler || !this.props.routing) {
            return;
        }
        if (this.props.resource.ready) {
            this.props.routing.push("/resource");
        }
    }

    private updateProtocolHandler = (e: any, index: number, handlerID: string) => {
        if (!this.props.plugins || !this.props.resource || !this.props.settings) {
            return null;
        }

        const handler = this.props.plugins.protocolHandlers
            .find((h) => h.__macko_impl_id__ === handlerID);

        if (handler) {
            this.props.resource.handler = handler;
            this.props.settings.handlerID = handlerID;
        }
    }

    private updateUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!this.props.resource || !this.props.resource.handler || !this.props.plugins) {
            return;
        }
        const handler = this.props.resource.handler;
        const value = e.target.value;

        // Get the old protocol
        let oldProto;
        try {
            oldProto = new URL(this.props.resource.url || "").protocol + "//";
        }  catch (e) {
            oldProto = handler.protocol;
        }

        // Het the new UEL
        let newUrl;
        try {
            const url = new URL(value);
            if (url.protocol && url.host) {
                newUrl = value;
            } else {
                newUrl = oldProto + value;
            }
        } catch (e) {
            newUrl = oldProto + value;
        }

        this.props.resource.url = newUrl;
    }

    private setHandler(handler: Implementation<IProtocolHandler>) {
        if (!this.props.plugins || !this.props.resource || !this.props.settings) {
            return null;
        }
        this.props.resource.handler = handler;
        this.props.settings.handlerID = handler.__macko_impl_id__;
    }
}
