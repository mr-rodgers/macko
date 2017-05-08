import { observer } from "mobx-react";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import Reflow from "./Reflow";
import StackLayout from "./StackLayout";
import UrlInput from "./UrlInput";

@observer
export default class WelcomeView extends React.Component<RouteComponentProps<any>, {}> {
    private get styles() {
        return {
            contentSpaced: {
                height: "calc(100% - 40px)",
                margin: "20px",
                position: "relative" as "relative",
                width: "calc(100% - 40px)",
            },
        };
    }

    public render() {
        const mediaQueries = {
            main: {
                "(min-height: 400px)": { basis: "300px", grow: 0 },
                "(min-width: 900px)": { basis: "65%", grow: 1 },
                // tslint:disable-next-line:object-literal-sort-keys
                "(min-width: 1100px)": { basis: "700px", grow: 0 },
            },
            panel: {
                "(min-width: 900px)": { orientation: "horizontal" },
            },
            recents: {
                "(min-height: 400px)": { grow: 1 },
                "(min-width: 900px)": { basis: "35%", grow: 1 },
                // tslint:disable-next-line:object-literal-sort-keys
                "(min-width: 1100px)": { grow: 1 },
            },
        };

        return (
            <Reflow queries={mediaQueries.panel}>
                <StackLayout contentFill="stretch">
                    <Reflow queries={mediaQueries.main}>
                        <StackLayout.Panel basis="100%">
                            <div style={this.styles.contentSpaced}>
                                <UrlInput />
                            </div>
                        </StackLayout.Panel>
                    </Reflow>
                    <Reflow queries={mediaQueries.recents}>
                        <StackLayout.Panel basis="0%" background="#fcfcfc">
                        </StackLayout.Panel>
                    </Reflow>
                </StackLayout>
            </Reflow>
        );
    }
}
