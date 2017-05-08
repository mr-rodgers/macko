import { observable } from "mobx";
import {
    isLoaded,
    LoadedExtension,
    PluginHooker,
 } from "plugin-hooker";
import { Jspm as JspmBackend } from "plugin-hooker/backends";

export interface IProtocolHandler {
    protocol: string;
    name: string;
    supportedPayloads: string[];
    watch(url: string): IResourceWatcher;
}

export interface IResourceWatcher extends NodeJS.EventEmitter {
    /** Quit watching the resource and dispose any changes */
    close(): void;

    on(event: "message", listener: MessageListener): this;
    on(event: "closed", listener: StreamClosedListener): this;
    on(event: "error", listener: ErrorListener): this;
    addListener(event: "message", listener: MessageListener): this;
    addListener(event: "closed", listener: StreamClosedListener): this;
    addListener(event: "error", listener: ErrorListener): this;
}

/**
 * A listener for 'message' events on a IResourceWatcher stream.
 * @param message - A plain-text message that was received
 * @param metadata - Metadata about the message
 */
export type MessageListener = (message: string, metadata?: IMessageMetadata) => void;

export interface IMessageMetadata {
    /** The mime-type for the message */
    mime?: string;
    /** A date object indicating when the message was sent */
    date?: Date;
}

/** A listener for a stream closed event on an IResourceWatcher stream */
export type StreamClosedListener = () => void;

/** An error handler for an IResourceWatcher stream */
export type ErrorListener = (error: Error) => void;

export type Implementation<T> = T & { __macko_impl_id__: string };

const protocolHandlerHook = "macko:hooks:protocol-handler";

export class PluginStore {
    @observable public protocolHandlers: Array<Implementation<IProtocolHandler>> = [];
    private hooker: PluginHooker;

    constructor(folder: string) {
        this.hooker = new PluginHooker(new JspmBackend(folder));
        this.autoUpdateImplementations(protocolHandlerHook, this.protocolHandlers);
    }

    private autoUpdateImplementations<T>(hook: string, storeIn: Array<Implementation<T>>): void {
        this.hooker.watch<T>(hook)
            .subscribe((extensions) => {
                // any is necessary here until https://github.com/Microsoft/TypeScript/issues/7657
                // is resolved.
                const nonErrored: Array<LoadedExtension<T>> = extensions.filter(isLoaded) as any;
                const impls: Array<Implementation<T>> = nonErrored
                    .map((ext) => Object.assign(ext.value, {__macko_impl_id__: `${ext.packageId}:${ext.name}`}));
                storeIn.splice(0, storeIn.length, ...impls);
            });
    }
}
