import { MockListener } from "../__mocks__/resource-listener";
import { IMessage, IResource, Resource } from "../resource";

let resource: IResource;
let listener: MockListener;

beforeEach(() => {
    listener = new MockListener("Event Source", ["http", "https"]);
    resource = new Resource("https://test.example.com/resource", listener);
});

test("#state is initially 'closed'.", () => {
    expect(resource.state).toBe("closed");
});

describe("when #listen() is active", () => {
    beforeEach(() => resource.listen());

    test("#state changes to 'connected' when the resource stream emits 'connected' event", () => {
        listener.stream.emit("connected");
        expect(resource.state).toBe("connected");
    });

    test("#state changes to 'connected' when the resource stream emits a message", () => {
        listener.stream.emit("message", "Freedom is minnnneeee");
        expect(resource.state).toBe("connected");
    });

    test("#state changes to 'connected' again if a message is emitted after an error", () => {
        listener.stream.emit("error", new Error("Something bad has happened."));
        listener.stream.emit("message", "Freedom is minnnneeee");
        expect(resource.state).toBe("connected");
    });

    test("#state changes to 'error' when the resource stream emits an Error", () => {
        listener.stream.emit("error", new Error("Something bad has happened."));
        expect(resource.state).toBe("error");
    });

    test("#state changes to 'closed' when the resource stream emits a 'closed' event", () => {
        listener.stream.emit("closed");
        expect(resource.state).toBe("closed");
    });

    test("#stop() closes the underlying stream", () => {
        resource.stop();
        expect(listener.stream.close).toBeCalled();
    });

    test("#stop() changes #state to 'closed", () => {
        resource.stop();
        expect(resource.state).toBe("closed");
    });

    test("#messages should update after stream sends a message event", () => {
        const messages: IMessage[] = [
            { data: "This is a text message", metadata: { mime: "text/plain" } },
            { data: new Blob(["some blob data"], { type: "text/plain" }), metadata: {} },
        ];
        messages.forEach((msg) => listener.stream.emit("message", msg.data, msg.metadata));
        expect(resource.messages.length).toBe(2);
        expect(resource.messages[0]).toMatchObject(messages[0]);
        expect(resource.messages[1]).toMatchObject(messages[1]);
    });
});
