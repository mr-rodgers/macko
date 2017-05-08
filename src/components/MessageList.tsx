import {inject, observer} from "mobx-react";
import * as React from "react";
// tslint:disable-next-line:no-var-requires
const zenscroll: any = require("zenscroll");

import { ResourceStore } from "../stores/resource";
import StackLayout from "./StackLayout";

interface IMessageListProps {
    resource?: ResourceStore;
}

@inject("resource")
@observer
export default class MessageListView extends React.Component<IMessageListProps, {}> {
    private messageList: HTMLDivElement;
    private resourceStore: ResourceStore;

    constructor(props: IMessageListProps) {
        super(props);

        if (props.resource) {
            this.resourceStore = props.resource;
        }
    }

    public render() {
        const messages = this.resourceStore.received
            .filter((msg) => msg.type !== "error");

        return (
            <StackLayout>
                <StackLayout.Panel background="rgba(0, 0, 0, 0.1)" grow={1}>
                    <div style={{
                        backgroundColor: "#e53935",
                        color: "white",
                        fontSize: this.resourceStore.error ? "inherit" : "0px",
                        fontWeight: 300,
                        opacity: this.resourceStore.error ? 1 : 0,
                        padding: this.resourceStore.error ? "10px" : "0px",
                        transition: "all 0.3s ease-in-out",
                    }}
                    >
                       An error occurred: "{this.resourceStore.error || ""}"
                    </div>
                    <div className="smooth-scroll" style={{overflowY: "auto", overflowX: "hidden"}}
                        ref={(elem) => this.messageList = elem}>
                        {
                            messages.map((msg, i) => (
                                <pre key={i}
                                    style={{
                                        background: "white",
                                        fontFamily: "\"PT MONO\", monospace",
                                        fontWeight: 400,
                                        margin: "10px",
                                        padding: "15px",
                                    }}>{msg.text}</pre>
                            ))
                        }
                    </div>
                </StackLayout.Panel>
            </StackLayout>
        );
    }

    private scrollToBottom() {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        const scroller = zenscroll.createScroller(this.messageList, 300, 0);
        scroller.toY(maxScrollTop > 0 ? maxScrollTop : 0);
    }

    private componentDidUpdate() {
        this.scrollToBottom();
    }
}
