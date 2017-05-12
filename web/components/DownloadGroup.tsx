import { inject, observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { ReleasesStore } from "../stores/releases";

type DownloadPlatform = "win32" | "OSX" | "linux" | "tar";

interface IDownload {
    platform: DownloadPlatform;
    url: string;
}

interface IDownloadGroupProps {
    releases?: ReleasesStore;
    size?: "lg" | "sm" | "md";
    outline?: boolean;
    color?: any;
}

interface IDownloadGroupState {
    dropdownOpen: boolean;
}

const buttonLabels = {
    OSX: "Download for OS X 10.6+",
    linux: "Download for Linux",
    tar: "Download Source Tarball",
    win32: "Download for Windows 7+",
};

const shortButtonLabels = {
    OSX: "OS X",
    linux: "Linux",
    tar: "Source",
    win32: "Windows",
};

@inject("releases")
@observer
export default class DownloadGroup
        extends React.Component<IDownloadGroupProps, IDownloadGroupState> {

    private releases: ReleasesStore;
    private platform: DownloadPlatform;

    constructor(props: IDownloadGroupProps) {
        super(props);
        this.state = { dropdownOpen: false };

        if (props.releases) {
            this.releases = props.releases;
        }
        this.platform = defaultDownloadPlatform();
    }

    public render() {
        if (this.releases.latest === null) {
            return null;
        }

        const downloads = this.downloadList;
        const button = (
            <Button tag="a" href={downloads[0].url}
                    size={this.props.size}
                    color={this.props.color}>
                {buttonLabels[downloads[0].platform]}
            </Button>
        );
        if (downloads.length === 1) {
            return button;
        }

        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                {button}
                <DropdownToggle caret color={this.props.color} size={this.props.size} />
                <DropdownMenu>
                    {
                        downloads.slice(1).map((download: IDownload, i: number) => (
                            <DropdownItem key={i}>
                                <a href={download.url}>{buttonLabels[download.platform]}</a>
                            </DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </ButtonDropdown>
        );
    }

    private toggleDropdown = () => {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    private get downloadList() {
        if (this.releases.latest === null) {
            return [];
        }

        const release = this.releases.latest;
        const prominent = (release.downloads[this.platform] === null)
            ? "tar"
            : this.platform;
        const downloads: IDownload[] = [{
            platform: prominent,
            url: release.downloads[prominent],
        }] as IDownload[];

        ["tar", "win32", "OSX", "linux"].forEach((platform: DownloadPlatform) => {
            const url = release.downloads[platform];
            if (platform !== prominent && url !== null) {
                downloads.push({ platform, url });
            }
        });
        return downloads;
    }
}

function defaultDownloadPlatform() {
    if (!navigator || !navigator.platform) {
        return "tar";
    }

    if (/win32/i.test(navigator.platform)) {
        return "win32";
    }

    if (/mac/i.test(navigator.platform)) {
        return "OSX";
    }

    if (/linux/i.test(navigator.platform)) {
        return "linux";
    }

    return "tar";
}
