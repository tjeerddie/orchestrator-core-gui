import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import {unmountComponentAtNode} from "react-dom";
import {Link} from "react-router-dom";
import logo from "../images/network-automation.png";
import "./Header.css";
import UserProfile from "./UserProfile";
import {stop} from "../utils/Utils";

export default class Header extends React.PureComponent {

    constructor() {
        super();
        const hostname = window.location.hostname;
        this.state = {
            dropDownActive: false,
            environment: hostname.indexOf("staging") > -1 ? "staging" :
                hostname === "localhost" ? "local" : hostname.indexOf("dev") > -1 ? "development" : "production"
        };
    }

    stop = e => {
        stop(e);
        const node = document.getElementById("app");
        unmountComponentAtNode(node);
        localStorage.clear();
        window.location.href = "/";
    };

    handleToggle = e => {
        stop(e);
        this.setState({dropDownActive: !this.state.dropDownActive});
    };

    renderExitLogout = () =>
        <li className="border-left"><a onClick={this.stop}>{I18n.t("header.links.logout")}</a>
        </li>;

    renderProfileLink(currentUser) {
        return (
            <a className="welcome-link" onClick={this.handleToggle}>
                <i className="fa fa-user-circle-o"></i>
                {currentUser.displayName}
                {this.renderDropDownIndicator()}
            </a>
        );
    }

    renderDropDownIndicator() {
        return this.state.dropDownActive ? <i className="fa fa-caret-up"/> : <i className="fa fa-caret-down"/>;
    }

    renderDropDown(currentUser) {
        return this.state.dropDownActive ? <UserProfile currentUser={currentUser}/> : null;
    }

    renderEnvironmentName = environment => environment === "production" ?
        null : <li className="environment">{environment}</li>;

    render() {
        const {currentUser} = this.props;
        const {environment} = this.state;
        return (
            <div className="header-container">
                <div className="header">
                    <Link to="/" className="logo"><img src={logo} alt=""/></Link>
                    <ul className="links">
                        <li className={`title ${environment}`}><span>{I18n.t("header.title")}</span></li>
                        {this.renderEnvironmentName(environment)}
                        <li className="profile"
                            tabIndex="1" onBlur={() => this.setState({dropDownActive: false})}>
                            {this.renderProfileLink(currentUser)}
                            {this.renderDropDown(currentUser)}
                        </li>
                        <li dangerouslySetInnerHTML={{__html: I18n.t("header.links.help_html")}}></li>
                        {this.renderExitLogout()}
                    </ul>
                </div>
            </div>
        );
    }

}

Header.propTypes = {
    currentUser: PropTypes.object.isRequired,
};
