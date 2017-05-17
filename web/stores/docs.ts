import { action, computed, observable } from "mobx";


interface IDocCache {
    [index: string]: ICachedDocument | ILoadingDocument | undefined;
}

interface ICachedDocument {
    loading: false;
    text: string;
}

interface ILoadingDocument {
    loading: true;
    text?: string;
}

export class DocsStore {
    @observable public cache: IDocCache = {};
    private lastSeen: string[] = [];

    /**
     * A document store which fetches documents and caches recent ones
     * @param baseUrl base url to use when using `fetch` method
     * @param capacity the maximum number of documents that should be cached by the store
     */
    constructor(private baseUrl: string, private capacity = 4) { }

    /**
     * Fetch a document from the internet
     * @param docPath location of the document
     */
    @action public fetch = async (docPath: string) => {
        const url = [this.baseUrl, docPath].join("/");

        const oldVal = this.cache[docPath];
        this.updateCache(docPath, {loading: true, text: oldVal && oldVal.text});

        try {
            const response = await fetch(url);

            if (!response.ok) {
                this.updateCache(docPath, oldVal);
                return;
            }

            const text = await response.text();
            this.updateCache(docPath, {loading: false, text});
        } catch (err) {
            this.updateCache(docPath, oldVal);
        }
    }

    private updateCache(index: string, item: ICachedDocument | ILoadingDocument | undefined) {
        const newCache: IDocCache = {};

        // Update the last seen
        const lastSeen = this.lastSeen.filter((path) => path !== index);
        if (item !== undefined) {
            while (lastSeen.length >= this.capacity) {
                lastSeen.shift();
            }
            lastSeen.push(index);
        }

        lastSeen.forEach((key) => {
            if (key !== index) {
                newCache[key] = this.cache[key];
            } else if (item !== undefined) {
                newCache[index] = item;
            }
        });
        this.lastSeen = lastSeen;
        this.cache = newCache;
    }
}
