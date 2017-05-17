import { computed, observable } from "mobx";
import titleCase = require("title-case");

interface IDocTreeNode {
    children?: Array<IDocTreeNode | string>;
    id: string;
    title?: string;
}

interface IDocument {
    id: string;
    path: string;
    title: string;
}

type DocTree = IDocTreeNode[];

interface IDocSection {
    title: string;
    documents: IDocument[];
}

export class DocTreeStore {
    private static getTitle(item: IDocTreeNode) {
        if (item.title) {
            return item.title;
        }

        const names = item.id.split("/");
        const basename = names[names.length - 1];
        return titleCase(basename);
    }

    private static flatten(tree: Array<IDocTreeNode | string>, excludeIndex = true) {
        const children: IDocument[] = [];
        const unvisited = tree.slice().reverse();

        while (true) {
            const cur = unvisited.pop();
            if (cur === undefined) {
                break;
            }

            const current: IDocTreeNode = (typeof cur === "string")
                ? {id: cur}
                : cur;

            if (!(excludeIndex && current.children)) {
                children.push({
                    id: current.id,
                    path: current.id + (current.children ? "/index.md" : ".md"),
                    title: this.getTitle(current),
                });
            }

            if (current.children !== undefined) {
                unvisited.push(...(
                    current.children
                        .map((node) =>
                            (typeof node === "string")
                                ? [current.id, node].join("/")
                                : {...node, id: [current.id, node.id].join("/")},
                        )
                        .reverse()
                ));
            }
        }

        return children;
    }

    @observable private tree: DocTree;

    constructor(tree: DocTree) {
        this.tree = tree;
    }

    @computed public get flattened(): IDocument[] {
        return DocTreeStore.flatten(this.tree);
    }

    @computed public get sections(): IDocSection[] {
        return this.tree
            .filter((node) => node.children !== undefined)
            .map((node) => ({
                documents: DocTreeStore.flatten(node.children as Array<IDocTreeNode | string>)
                    .map((doc) => ({
                        ...doc,
                        id: [node.id, doc.id].join("/"),
                        path: [node.id, doc.path].join("/"),
                    })),
                title: DocTreeStore.getTitle(node),
            }));
    }
}
