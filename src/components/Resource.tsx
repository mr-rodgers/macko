import * as React from "react";
import { RouteComponentProps } from "react-router";

import AddressBar from "./AddressBar";
import MessageList from "./MessageList";
import Reflow from "./Reflow";
import StackLayout from "./StackLayout";

export default class ResourceView extends React.Component<RouteComponentProps<any>, {}> {
    public render() {
        return (
            <StackLayout contentFill="stretch">
                <StackLayout.Panel grow={0} shrink={0}>
                    <AddressBar />
                </StackLayout.Panel>
                <StackLayout.Panel grow={1}>
                    <MessageList />
                </StackLayout.Panel>
            </StackLayout>
        );
    }
}
