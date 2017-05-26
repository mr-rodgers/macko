import { action, observable } from "mobx";

import { Implementation, IPluginStore } from "./plugins";

export interface IResourceListener {
    readonly protocols: string[];
    readonly name: string;
    watch(request: IResourceWatchRequest): IResourceEventStream;
}

export interface IResourceWatchRequest {
    url: string;
    body?: string;
    headers?: any;
}

export interface IResourceEventStream extends NodeJS.EventEmitter {
    /** Quit watching the resource and dispose any changes */
    close(): void;

    on(event: "message", listener: MessageListener): this;
    on(event: "connected", listener: ConnectListener): this;
    on(event: "closed", listener: StreamClosedListener): this;
    on(event: "error", listener: ErrorListener): this;
    addListener(event: "message", listener: MessageListener): this;
    addListener(event: "connected", listener: ConnectListener): this;
    addListener(event: "closed", listener: StreamClosedListener): this;
    addListener(event: "error", listener: ErrorListener): this;
}

/**
 * A listener for 'message' events on a `IResourceEventStream`.
 * @param message A plain-text message that was received
 * @param metadata Metadata about the message
 */
export type MessageListener = (message: string | Blob, metadata?: IMessageMetadata) => void;

export interface IMessageMetadata {
    /** The mime-type for the message */
    mime?: string;
    /** A date object indicating when the message was sent */
    date?: Date;
}

/** A handler for 'connect' events on a `IResourceEventStream`. */
export type ConnectListener = () => void;

/** A listener for a stream closed event on an `IResourceEventStream`. */
export type StreamClosedListener = () => void;

/** An error handler for an `IResourceEventStream`. */
export type ErrorListener = (error: Error) => void;

export interface IResourceListenerStore {
    listeners: ReadonlyArray<Implementation<IResourceListener>>;
    bestFit(url: string): Implementation<IResourceListener> | null;
}

const resourceListenerHook = "macko/hooks/resource-listener";

export class ResourceListenerStore implements IResourceListenerStore {
    /** An observable read-only array of resource listener implementations. */
    @observable public listeners: ReadonlyArray<Implementation<IResourceListener>> = [];

    /**
     * Construct a new `ResourceListenerStore`.
     * @param plugins a `PluginStore` instance used to find the resource listeners
     */
    constructor(private plugins: IPluginStore) {
        this.plugins.watchImplementations<IResourceListener>(resourceListenerHook)
            .subscribe((listeners) => this.listeners = listeners);
    }

    /**
     * Return an `IResourceListener` implementation which is the best fit for listening to
     * the given url.
     */
    public bestFit(url: string) {
        let u: URL;
        try {
            u = new URL(url);
        } catch (err) {
            return null;
        }

        const listener = this.listeners.find((l) => l.protocols.indexOf(u.protocol) !== -1);
        return listener || null;
    }
}
