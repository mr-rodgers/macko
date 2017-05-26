import { observable } from "mobx";

const lastModifiedKey = "__last_modified__";

export interface ISettings {
    /** A date/time when the settings were last changed. */
    readonly modified: Date | null;

    /**
     * Set a value
     */
    setItem(key: string, item: any): void;

    /**
     * Get a typed value
     */
    getItem<T>(key: string): T | null;

    /**
     * Delete a value
     */
    removeItem(key: string): void;
}

export class Settings implements ISettings {
    @observable public modified: Date | null;

    constructor() {
        const lastM = this.getItem<number>(lastModifiedKey);
        this.modified = lastM === null
            ? null
            : new Date(lastM);
    }

    public setItem(key: string, item: any): void {
        window.localStorage.setItem(key, JSON.stringify(item));
        if (key !== lastModifiedKey) {
            this.modify();
        }
    }

    public getItem<T>(key: string): T | null {
        const val: string | null = window.localStorage.getItem(key);
        return val === null
            ? null
            : JSON.parse(val) as T;
    }

    public removeItem(key: string) {
        window.localStorage.removeItem(key);
        this.modify();
    }

    private modify() {
        this.modified = new Date();
        this.setItem(lastModifiedKey, this.modified.valueOf());
    }
}
