import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Button } from "reactstrap";

import DownloadGroup from "./DownloadGroup";

export default class Landing extends React.Component<RouteComponentProps<any>, {}> {
    public render() {
        return (
            <div className="landing" >
                <div className="landing-hero">
                    <div className="landing-text" style={{position: "relative"}}>
                        <h1>Macko 👀</h1>
                        <p className="lead">Watch real-time web resources—in real time.</p>
                        {/*<p>
                            You'll see data as soon as it's sent.
                            It works with WebSockets, ServerSent Events and anything you want.
                        </p>*/}
                        <DownloadGroup color="primary" size="lg" />
                    </div>
                    <div className="screenshot"></div>
                </div>
            </div>
        );
    }
}
