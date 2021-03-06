import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PageTitle from "./PageTitle";
import _ from "lodash";
const $ = require("jquery");

class Administration extends PureComponent {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            showNavigation: false,
            showDropdown: false
        };
    }
    // Adds an event listener when the component is mount.
    componentDidMount() {
        $(".content").on("scroll", function() {
            if ($(".content").scrollTop() > 120) {
                $(".nav-area").addClass("shrink-nav-area");
                $(".content-area").addClass("top-content-area");
            } else {
                $(".nav-area").removeClass("shrink-nav-area");
                $(".content-area").removeClass("top-content-area");
            }
        });
    }

    componentWillUnmount() {
        $(".content").off("scroll", function() {
            if ($(".content").scrollTop() > 120) {
                $(".nav-area").addClass("shrink-nav-area");
                $(".content-area").addClass("top-content-area");
            } else {
                $(".nav-area").removeClass("shrink-nav-area");
                $(".content-area").removeClass("top-content-area");
            }
        });
    }

    getModule() {
        let url = this.props.match.path.split("/")[4];
        url = _.replace(url, "-", " ");
        url = _.capitalize(url);
        return url;
    }

    render() {
        return (
            <section className="content">
                <PageTitle
                    user={this.props.user}
                    module={this.getModule()}
                    visible={this.state.visible}
                ></PageTitle>
                <div className="content-area">{this.props.children}</div>
            </section>
        );
    }
}

const mapStateToProps = (state, router) => {
    return {
        user: state.user,
        match: router.match,
        isAuthenticated: state.auth.isAuthenticated
    };
};

export default connect(mapStateToProps)(Administration);
