import { inject, observer } from "mobx-react";
import * as React from "react";

import { DocTreeStore } from "../stores/doctree";
import DocSection from "./DocSection";

interface IDocNavProps {
    doctree?: DocTreeStore;
    baseUrl?: string;
    location: any;
}

@inject("doctree")
@observer
export default class DocNav extends React.PureComponent<IDocNavProps, {}> {
    public static defaultProps: Partial<IDocNavProps> = {
        baseUrl: "",
    };

    public render() {
        const doctree = this.props.doctree;
        const baseUrl = this.props.baseUrl as string;
        const location = this.props.location;

        if (!doctree) {
            return null;
        }

        return (
            <aside className="doc-nav">
                {
                    doctree.sections.map((section, id) => (
                        <DocSection
                            key={id}
                            title={section.title}
                            location={location}
                            docs={
                                section.documents.map((doc) => ({
                                    route: [baseUrl, doc.id].join("/"),
                                    title: doc.title,
                                }),
                            )}
                        />
                    ))
                }
            </aside>
        );
    }
}
