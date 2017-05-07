import { computed, observable } from "mobx";

interface IJSONSerializableObj {
    [index: string]: JSONSerializable;
}

type JSONSerializable = IJSONSerializableObj | string | number | Array<(IJSONSerializableObj | string | number)>;

const protocolHandlerKey = "last-used-protocol-handler";

export class SettingsStore {
    @observable private lastEditTime = 0;

    public setItem(key: string, item: JSONSerializable): void {
        window.localStorage.setItem(key, JSON.stringify(item));
        this.lastEditTime = Date.now();
    }

    public getItem<T>(key: string): T | null {
        // tslint:disable-next-line:no-unused-expression
        this.lastEditTime; // Trick mobx into thinking we need this
        const val: string | null = window.localStorage.getItem(key);
        return val === null
            ? null
            : JSON.parse(val) as T;
    }

    public removeItem(key: string) {
        window.localStorage.removeItem(key);
        this.lastEditTime = Date.now();
    }

    @computed
    public get handlerID(): string | null {
        return this.getItem<string>(protocolHandlerKey);
    }

    public set handlerID(val: string | null) {
        if (val !== null) {
            this.setItem(protocolHandlerKey, val);
        } else {
            this.removeItem(protocolHandlerKey);
        }
    }
}
