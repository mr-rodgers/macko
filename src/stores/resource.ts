import { computed, observable } from "mobx";
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

export class Resource {
    @observable public url?: string;
    @observable public handler?: IProtocolHandler;
    @observable private messages: IMessage[] = [];
    private messageEmitter?: IResourceWatcher;

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
        }
    }

    private storeMessagesInCache() {
        this.settings.setItem(this.cacheKey, this.messages);
    }

    private loadMessagesFromCache() {
        this.messages = this.settings.getItem<IMessage[]>(this.cacheKey) || [];
    }

    @computed
    public get received() {
        return this.messages.filter((msg) => msg.type === "received");
    }

    public get isListening() {
        return (this.messageEmitter !== undefined);
    }

    private get cacheKey() {
       return  `${this.url || ""}:messages`;
    }
}
