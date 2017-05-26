import { EventEmitter } from "events";
import { Observable } from "rxjs/Observable";
import uuidV4 = require("uuid");

import "rxjs/add/observable/fromEvent";

import { Implementation, IPluginStore } from "../plugins";

export class PluginStore implements IPluginStore {
    private events = new EventEmitter();

    public watchImplementations<T>(hook: string) {
        return Observable.fromEvent<Array<Implementation<T>>>(this.events, hook);
    }

    public updateImplementations<T>(hook: string, impls: ReadonlyArray<T | Implementation<T>>) {
        impls.forEach((ext: Implementation<T>) => {
            if (ext.__macko_impl_id__ === undefined) {
                ext.__macko_impl_id__ = uuidV4();
            }
        });
        this.events.emit(hook, impls);
    }
}
