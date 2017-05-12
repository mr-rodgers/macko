import { action, computed, observable } from "mobx";

interface IReleaseInfo {
    tag: string;
    name: string;
    prerelease: boolean;
    publish_date: Date;
    downloads: {
        win32: string | null;
        OSX: string | null;
        linux: string | null;
        zip: string;
        tar: string;
    };
}


export class ReleasesStore {
    @observable public releases: IReleaseInfo[] = [];

    constructor(private repoName: string, private excludePreReleases = false) {
        this.refresh();
    }

    @action
    public async refresh() {
        const response = await fetch(
            `https://api.github.com/repos/${this.repoName}/releases`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
            },
        );
        if (!response.ok) {
            throw new Error("Could not fetch the current release set");
        }

        this.releases = (await response.json())
            .map((rawRelease: any) => ({
                downloads: {
                    OSX: this.getDownloadUrl(rawRelease.assets, /Macko-[^\/]*mac/i),
                    linux: this.getDownloadUrl(rawRelease.assets, /Macko-[^\/]*linux/i),
                    tar: rawRelease.tarball_url,
                    win32: this.getDownloadUrl(rawRelease.assets, /Macko-[^\/]*win32/i),
                    zip: rawRelease.zipball_url,
                },
                name: rawRelease.name,
                prerelease: rawRelease.prerelease,
                publish_date: new Date(rawRelease.published_at),
                tag: rawRelease.tag_name,
            }));
    }

    @computed public get latest() {
        if (this.releases.length === 0) {
            return null;
        }

        const sorted = this.releases.slice()
            .sort((a, b) => b.publish_date.valueOf() - a.publish_date.valueOf());
        return sorted[0];
    }

    private getDownloadUrl(assets: any[], regex: RegExp): string | null {
        const ass = assets.find((a) => regex.test(a.name));
        return ass ? ass.browser_download_url : null;
    }
}
