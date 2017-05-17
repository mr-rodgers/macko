import { inject, observer } from "mobx-react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";


interface IDocSectionProps {
    location: any;
    title: string;
    docs: Array<{
        route: string;
        title: string;
    }>;
}

export default class DocSection extends React.PureComponent<IDocSectionProps, {}> {
    public render() {
        const {title, docs} = this.props;
        return (
            <Nav vertical>
                <NavItem><h2>{title}</h2></NavItem>
                {
                    docs.map((item, i) => (
                        <NavItem key={i}>
                            <NavLink to={item.route} className="nav-link">{item.title}</NavLink>
                        </NavItem>
                    ))
                }
            </Nav>
        );
    }
}
