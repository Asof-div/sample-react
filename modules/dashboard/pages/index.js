/* ============
 * Container
 * ============.
 *
 * Containers are used fetch the data from state
 * and disperse to the components.
 */

// import libs
import { connect } from "react-redux";
import User from "../../user/models/User";

// import components
import Page from "./Page";

// map store state as properties of the component
const mapStateToProps = state => {
    const callSummary = state.dashboard.callSummary || {};
    const orderSummary = state.dashboard.orderSummary || {};
    return {
        user: new User(state.user),
        callSummary,
        orderSummary
    };
};

// binding store with component
export default connect(mapStateToProps)(Page);
