import { computed, observable } from "mobx";
import * as url from "url";

import { IProtocolHandler, IResourceWatcher } from "./plugins";
import { SettingsStore } from "./settings";

interface IMessage {
    type: "sent" | "received" | "error";
    text: string;
    mime?: string;
}

interface IExtraMessageData {
    mime?: string;
}

export class ResourceStore {
    @observable public url?: string;
    @observable public handler?: IProtocolHandler;
    @observable private messages: IMessage[] = [];
    @observable private messageEmitter?: IResourceWatcher;

    constructor(private settings: SettingsStore) { }

    /**
     * Start listening for events using the currently set handler
     * and url. If another resource is being listened to, then
     * that will stop.
     */
    public start() {
        if (this.isListening) {
            this.stop();
        }

        const url = this.url;
        const handler = this.handler;

        if (!url || !handler) {
            // Can't watch anything with these parameters
            throw new Error("Both url and handler must be set before starting to listen");
        }

        this.loadMessagesFromCache();
        this.messages = [];

        const emitter = this.messageEmitter = handler.watch(url);
        emitter.on("message", (text: string, extraData?: IExtraMessageData) => {
            let message: IMessage = {text, type: "received"};
            if (extraData) {
                message = {...message, ...extraData};
            }
            this.messages.push(message);
            this.storeMessagesInCache();
        });

        emitter.on("error", (error: Error) => {
            this.messages.push({type: "error", text: error.message});
            this.storeMessagesInCache();
        });

        emitter.on("closed", () => delete this.messageEmitter);
    }

    public stop() {
        if (this.messageEmitter) {
            this.messageEmitter.removeAllListeners();
            this.messageEmitter.close();
            this.messageEmitter = undefined;
        }
    }

    private storeMessagesInCache() {
        const messages = this.messages.filter((msg) => msg.type !== "error");
        this.settings.setItem(this.cacheKey, messages);
    }

    private loadMessagesFromCache() {
        this.messages = this.settings.getItem<IMessage[]>(this.cacheKey) || [];
    }

    @computed
    public get received() {
        return this.messages.filter((msg) => msg.type === "received" || msg.type === "error");
    }

    @computed
    public get isListening() {
        return (this.messageEmitter !== undefined);
    }

    @computed
    public get ready(): boolean {
        const handler = this.handler;
        const urlText = this.url;

        if (!handler || !urlText) {
            return false;
        }

        const urlParts = url.parse(urlText);
        return !!urlParts.hostname;
    }

    @computed
    public get error(): string | undefined {
        if (this.messages.length === 0) {
            return;
        }
        const message = this.messages[this.messages.length - 1];
        if (message.type !== "error") {
            return;
        }
        return message.text;
    }

    private get cacheKey() {
       return  `${this.url || ""}:messages`;
    }
}
