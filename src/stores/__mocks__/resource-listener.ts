import { EventEmitter } from "events";
import { IResourceListener, IResourceWatchRequest } from "../resource-listener";

export class MockListener implements IResourceListener {
    public watch = jest.fn((req: IResourceWatchRequest) => {
        return this.stream;
    });

    private stream = new MockResourceStream();
    constructor(public name: string, public protocols: string[]) { }
    public emit(event: string | symbol, ...args: any[]): boolean {
        return this.stream.emit(event, ...args);
    }
}


// tslint:disable-next-line:max-classes-per-file
class MockResourceStream extends EventEmitter {
    public close() { return; }
}
