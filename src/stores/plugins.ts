import {
    isLoaded,
    LoadedExtension,
    PluginHooker,
 } from "plugin-hooker";
import { Jspm as JspmBackend } from "plugin-hooker/backends";
import { Observable } from "rxjs/Observable";

export type Implementation<T> = T & { __macko_impl_id__: string };

export interface IPluginStore {
    watchImplementations<T>(hook: string): Observable<ReadonlyArray<Implementation<T>>>;
}

export class PluginStore implements IPluginStore {
    private hooker: PluginHooker;

    constructor(folder: string) {
        this.hooker = new PluginHooker(new JspmBackend(folder));
    }

    public watchImplementations<T>(hook: string) {
        return this.hooker.watch<T>(hook)
            .map((extensions) => {
                const nonErrored: Array<LoadedExtension<T>> = extensions.filter(isLoaded) as any;
                const impls: Array<Implementation<T>> = nonErrored
                    .map((ext) => Object.assign(ext.value, {__macko_impl_id__: `${ext.packageId}:${ext.name}`}));
                return impls;
            });
    }
}
