import { EventEmitter } from "events";
import { IResourceListener } from "../resource-listener";

export class MockListener implements IResourceListener {
    public watch = jest.fn(() => {
        return this.stream;
    });
    public stream = new MockResourceStream();
    constructor(public name: string, public protocols: string[]) { }
}


// tslint:disable-next-line:max-classes-per-file
class MockResourceStream extends EventEmitter {
    public close = jest.fn(() => this.emit("closed"));
}
