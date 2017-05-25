import { IExtensionInfo, IPackage, IPackageMetadata } from "plugin-hooker";

interface IExtension {
    info: IExtensionInfo;
    value: any;
}

export default class MockPackage implements IPackage {
    constructor(
        public id: string,
        public metadata: IPackageMetadata,
        private exts: IExtension[],
    ) { }

    public async load(extInfo: IExtensionInfo) {
        const ext = this.exts.find((e) => e.info.hook === extInfo.hook && e.info.name === extInfo.name);
        return ext ? ext.value : null;
    }

    public get extensions() {
        return this.exts.map((ext) => ext.info);
    }
}
