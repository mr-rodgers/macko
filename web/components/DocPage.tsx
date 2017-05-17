import { inject, observer } from "mobx-react";
import * as React from "react";
import * as Markdown from "react-markdown";

import { DocsStore} from "../stores/docs";
import { DocTreeStore } from "../stores/doctree";

interface IDocPageProps {
    doctree?: DocTreeStore;
    docs?: DocsStore;
    path: string;
    title: string;
}

interface IMarkdownDoc {
    loading: boolean;
    text?: string;
}

@inject("docs", "doctree")
@observer
export default class DocSection extends React.Component<IDocPageProps, {}> {
    public componentWillMount() {
        const {docs, path, title} = this.props;

        if (docs && !docs.cache[path]) {
            docs.fetch(path);
        }
    }

    public render() {
        const {docs, path, title} = this.props;
        let content = null;

        if (docs && docs.cache[path]) {
            const markdownDoc = docs.cache[path] as IMarkdownDoc;

            if (!markdownDoc.text) {
                content = (
                    <header>
                        <h1>{title}</h1>
                        <div className="loader">Loading...</div>
                    </header>
                );
            } else {
                content = (
                    <div>
                        {markdownDoc.loading && <div className="loader">Loading...</div>}
                        <Markdown source={markdownDoc.text} />
                    </div>
                );
            }
        }

        return <div className="document">{content}</div>;
    }
}
