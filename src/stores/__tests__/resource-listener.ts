import { PluginStore } from "../__mocks__/plugins";
import { MockListener } from "../__mocks__/resource-listener";
import { IResourceListenerStore, ResourceListenerStore } from "../resource-listener";

let pluginStore: PluginStore;
let rls: IResourceListenerStore;

const listeners = {
    eventSource: new MockListener("EventSource", ["http:", "https:"]),
    socketIO: new MockListener("Socket.IO", ["sio:"]),
    webSocket: new MockListener("WebSocket", ["ws:", "wss:"]),
};
const listenerArray = Object.keys(listeners).map((key) => listeners[key] as MockListener);
const hook = "macko/hooks/resource-listener";

beforeEach(() => {
    pluginStore = new PluginStore();
    rls = new ResourceListenerStore(pluginStore);
});

test("#listeners is empty by default", () => {
    expect(rls.listeners.slice()).toEqual([]);
});

test("#listeners should ignore implementations from another hook", () => {
    const otherHook = "not-the-resource-listener-hook";
    pluginStore.updateImplementations(otherHook, listenerArray.slice());
    expect(rls.listeners.slice()).toEqual([]);
});

test("#listeners should auto-update with new implementations from plugin store", () => {
    const implsPowerSet = [
        [],
        [listeners.eventSource],
        [listeners.socketIO],
        [listeners.webSocket],
        [listeners.eventSource, listeners.socketIO],
        [listeners.socketIO, listeners.webSocket],
        [listeners.eventSource, listeners.webSocket],
        [listeners.eventSource, listeners.socketIO, listeners.webSocket],
    ];

    implsPowerSet.forEach((impls) => {
        pluginStore.updateImplementations(hook, impls);
        expect(rls.listeners.slice()).toEqual(impls);
    });
});

test("#bestFit() should return null if no listeners are available", () => {
    expect(rls.bestFit("https://foo.bar.com/resource")).toBe(null);
});

test("#bestFit() should return null if the URL is malformed", () => {
    pluginStore.updateImplementations(hook, listenerArray.slice());
    expect(rls.bestFit("http:")).toBe(null);
});

test("#bestFit() should null if an appropriate listener is unavailable", () => {
    pluginStore.updateImplementations(hook, listenerArray.slice(0, 1));
    expect(rls.bestFit("ws://echo.websocket.org")).toBe(null);
});

test("#bestFit() should return the appropriate listener for a protocol", () => {
    pluginStore.updateImplementations(hook, listenerArray.slice());
    expect(rls.bestFit("https://foo.bar.com/resource")).toBe(listeners.eventSource);
    expect(rls.bestFit("wss://echo.websocket.org")).toBe(listeners.webSocket);
    expect(rls.bestFit("sio://foo-bar")).toBe(listeners.socketIO);
    expect(rls.bestFit("http://foo.bar.com/resource")).toBe(listeners.eventSource);
    expect(rls.bestFit("ws://echo.websocket.org")).toBe(listeners.webSocket);
});
