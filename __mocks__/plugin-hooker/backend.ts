import { EventEmitter } from "events";
import { IPackageFinder, PackageListener } from "plugin-hooker";

import MockPackage from "./package";

export default class MockPackageFinder implements IPackageFinder {
    public static setPackages(folder: string, packages: MockPackage[]) {
        this.packages[folder] = packages;
        this.emitter.emit(folder, packages.slice());
    }

    public static addPackage(folder: string, pkg: MockPackage) {
        if (!this.packages[folder]) {
            this.packages[folder] = [];
        }
        this.packages[folder].push(pkg);
        this.emitter.emit(folder, this.packages[folder].slice());
    }

    public static for(folder: string) {
        return this.packages[folder] ? this.packages[folder] : [];
    }

    private static packages: {[index: string]: MockPackage[]} = {};
    private static emitter = new EventEmitter();

    constructor(private folder: string) { }

    public watch(observer: PackageListener): () => void {
        const cls = MockPackageFinder;

        cls.emitter.addListener(this.folder, observer);
        observer(cls.for(this.folder).slice());

        return () => {
            cls.emitter.removeListener("change", observer);
        };
    }
    public async find() {
        return MockPackageFinder.for(this.folder).slice();
    }
}
