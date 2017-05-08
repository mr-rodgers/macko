import * as React from "react";

const propTranslators: {[index: string]: any} = {
    "end": "flex-end",
    "horizontal": "row",
    "spaced-even": "space-around",
    "spaced-inside": "space-between",
    "start": "flex-start",
    "vertical": "column",
};

interface IStackLayoutProps {
    orientation?: "horizontal" | "vertical";
    reversed?: boolean;
    contentAlignment?: "start" | "center" | "spaced-even" | "spaced-inside" | "end";
    contentFill?: "stretch" | "start" | "end" | "center" | "baseline";
    style?: any;
    fillHeight?: boolean;
}

interface IStackedPanelProps {
    background?: any;
    order?: number;
    basis?: any;
    grow?: number;
    shrink?: number;
    fill?: "stretch" | "start" | "end" | "center" | "baseline";
    style?: any;
}

export default class StackLayout extends React.Component<IStackLayoutProps, {}> {
    // tslint:disable-next-line:max-classes-per-file
    public static Panel = class extends React.Component<IStackedPanelProps, {}>{
        public render() {
            const style = {
                alignItems: "stretch",
                alignSelf: translateProp(this.props.fill),
                background: this.props.background,
                display: "flex",
                flexBasis: this.props.basis,
                flexDirection: "column",
                flexGrow: this.props.grow,
                flexShrink: this.props.shrink,
                order: this.props.order,
                position: "relative" as "relative",
                transition: "all 0.3s ease-out",
                ...(this.props.style || {}),
            };

            return <div style={style}>{this.props.children}</div>;
        }
    };

    public render() {
        let flexDirection = this.props.orientation
                ? translateProp(this.props.orientation)
                : "column";
        if (this.props.reversed) {
            flexDirection += "-reverse";
        }

        const style = {
            alignItems: translateProp(this.props.contentFill),
            display: "flex",
            flex: "1",
            flexDirection,
            justifyContent: translateProp(this.props.contentAlignment),
            position: "relative" as "relative", // <-- this shit is dumb as fuck. Do better TS.
            transition: "all 0.3s ease-out",
            ...(this.props.style || {}),
        };

        return <div style={style}>{this.props.children}</div>;
    }
}

function translateProp(prop: any) {
    return (prop in propTranslators)
        ? propTranslators[prop]
        : prop;
}
