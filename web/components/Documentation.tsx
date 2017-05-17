import { observer, Provider } from "mobx-react";
import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { DocsStore } from "../stores/docs";
import { DocTreeStore } from "../stores/doctree";
import DocNav from "./DocNav";
import DocPage from "./DocPage";

const doctree = new DocTreeStore([
    {
        children: [
            "installation",
            "roadmap",
            "faq",
        ],
        id: "getting-started",
    },
]);

const stores = {
    docs: new DocsStore("/macko/docs"),
    doctree,
};

@observer
export default class Documentation extends React.Component<RouteComponentProps<any>, {}> {
    public render() {
        const base = this.props.match.path;
        return (
            <Provider {...stores}>
                <Container className="docs">
                    <Row className="pl-3 pr-3">
                        <Col xs="3">
                            <DocNav baseUrl={base} location={this.props.location} />
                        </Col>
                        <Col xs="9">
                            <Switch>
                                {
                                    doctree.flattened
                                        .map((doc) => (
                                            <Route
                                                key={doc.path}
                                                exact
                                                path={[base, doc.id].join("/")}
                                                component={this.getDocComponent(doc.path, doc.title)}
                                            />
                                        ))
                                }
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </Provider>
        );
    }

    private getDocComponent(path: string, title: string) {
        return () => (
            <DocPage title={title} path={path} />
        );
    }
}
