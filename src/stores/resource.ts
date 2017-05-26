import { action, observable } from "mobx";

import {
    IMessageMetadata,
    IResourceEventStream,
    IResourceListener,
} from "./resource-listener";

export interface IResource {
    readonly url: string;
    readonly state: ResourceState;
    readonly messages: ReadonlyArray<IMessage>;
    readonly options: any;
    listen(): void;
    stop(): void;
}

export type ResourceState = "connecting" | "connected" | "error" | "closed";

export interface IMessage {
    data: string | Blob;
    metadata: IMessageMetadata;
}

export class Resource implements IResource {
    @observable public state: ResourceState = "closed";
    @observable public messages: IMessage[] = [];
    public options: any = {};

    @observable private streamError: Error | null = null;
    private stream: IResourceEventStream | null = null;

    constructor(
        public readonly url: string,
        private listener: IResourceListener,
    ) { }

    @action public listen = () => {
        this.state = "connecting";

        const stream = this.stream = this.listener.watch({ url: this.url });
        stream.addListener("connected", () => this.state = "connected");
        stream.addListener("closed", () => {
            this.state = "closed";
            this.stop();
        });
        stream.addListener("error", (err) => { this.state = "error"; this.streamError = err; });
        stream.addListener("message", (data, metadata: IMessageMetadata = {}) => {
            this.state = "connected";
            this.messages.push({data, metadata});
        });
    }

    @action public stop = () => {
        if (this.stream) {
            const stream = this.stream;
            this.stream = null;

            if (this.state !== "closed") {
                stream.close();
                this.state = "closed";
            }

            stream.removeAllListeners();
        }
    }
}
