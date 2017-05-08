import * as React from "react";


interface IReflowProps {
    queries: {
        [index: string]: {
            [index: string]: any,
        },
    };
}

interface IReflowState {
    childProps: { [index: string]: any; };
}

export default class Reflow extends React.Component<IReflowProps, IReflowState> {
    constructor(props: IReflowProps) {
        super(props);
        this.state = { childProps: {} };
    }

    public render() {
        const childProps = this.state.childProps;
        return React.cloneElement(
            React.Children.only(this.props.children),
            childProps,
        );
    }

    private componentDidMount() {
        this.selectChildProps();
        window.addEventListener("resize", this.selectChildProps);
    }

    private componentWillUnmount() {
        window.removeEventListener("resize", this.selectChildProps);
    }

    private selectChildProps = () => {
        const childProps = {};

        Object.keys(this.props.queries)
            .forEach((mediaQuery) => {
                if (window.matchMedia(mediaQuery).matches) {
                    Object.assign(childProps, this.props.queries[mediaQuery]);
                }
            });

        this.setState({childProps});
    }
}
