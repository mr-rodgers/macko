import * as React from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavItem } from "reactstrap";

import DownloadGroup from "./DownloadGroup";

interface INavBarProps {
    color?: any;
}

export default class NavBar extends React.PureComponent<INavBarProps, {}> {
    public render() {
        return (
            <Navbar color={this.props.color} light toggleable>
                <NavLink className="navbar-brand" to="/">Macko 👀</NavLink>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink className="nav-link" to="/docs">Docs</NavLink>
                    </NavItem>
                    <NavItem>
                        <DownloadGroup compact color="secondary" outline size="md" />
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}
