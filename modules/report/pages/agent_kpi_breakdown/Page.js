// import libs
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { agentKPIBreakdownReportRequest, agentKPIBreakdownExportReportRequest } from "../new_service";
import AgentKPIRow from "./components/AgentKPIRow";
import SearchDate from "../../../../utils/SearchDate";
import { saveAs } from 'file-saver'
import moment from 'moment';

class Page extends PureComponent {
    static displayName = "UserPage";
    static propTypes = {
        user: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        const user = this.props.user.toJson();
        
        this.state = {
            user,
            agentKPI: {
                startDate: "",
                endDate: "",
                agentSummaries:[]
            },
            filter: {
                calldate: this.props.calldate || moment().format('YYYY-MM-DD'),
                user_id: user.id
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.export = this.export.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const user = this.props.user.toJson();
        if (user.id) {
            this.setState({filter: { ...this.state.filter, user_id :user.id} });
            dispatch(agentKPIBreakdownReportRequest(this.state.filter)).then(data => {
                this.setState({agentKPI:data});
            });
        }
    }

    pageChange() {
        this.props.dispatch(agentKPIBreakdownReportRequest(this.state.filter)).then(data => {
            this.setState({agentKPI:data});
        });
    }

    export() {
        this.props.dispatch(agentKPIBreakdownExportReportRequest(this.state.filter))
        .then(blob => {
            let date = moment(this.state.filter).format('MMM YYYY');
            saveAs(blob,`agent-kpi-report-${this.state.user.name}-${date}.xlsx`)
        });
    }

    handleChange(name, value) {
        const filter = Object.assign(
            {},
            { ...this.state.filter, [name]: value }
        );
        this.setState({ filter });
    }

    renderAgents() {
        return this.state.agentKPI.agentSummaries.map((agent, index) => {
            return (
                <AgentKPIRow
                    key={index}
                    agent={agent}
                    index={index}
                />
            );
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {user, calldate } = nextProps;
        if (!_.isEqual(this.state.user, user.toJson() ) || !_.isEqual(this.state.filter.calldate, calldate )) {
            this.setState({ user: user.toJson(), filter: { ...this.state.filter, user_id :user.toJson().id, calldate} }, ()=>{
                this.pageChange();
            });
        }
    }

    render() {
        const {user, agentKPI} = this.state;
        return (
            <main className="page-container" role="main">
                <div className="row mt-3 bg-white py-2">
                    <div className="col">
                        <span className="h3">{user.name}</span>
                        <span className="float-right">
                            {`${ agentKPI && agentKPI.startDate} - ${agentKPI && agentKPI.endDate}`}
                        </span>
                    </div>
                </div>

                <div className="row mt-3 bg-white py-2 pt-3 ">
                    <div className="col">
                        <span className="float-right">


                            <div className="floating-label float-left mr-3 mb-0 pb-2">
                                <SearchDate
                                    label="Month"
                                    name="calldate"
                                    value={this.state.filter.calldate}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="floating-label float-left mr-3 mb-0 pb-2">
                                <button
                                    onClick={e => this.pageChange()}
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                >
                                    Filter
                                </button>
                            </div>

                            <div className="floating-label float-left mr-3 mb-0 pb-2">
                                <button
                                    onClick={e => this.export()}
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                >
                                    Export
                                </button>
                            </div>
                        </span>
                    </div>
                </div>

                <div className="row mt-3 bg-white py-2">
                    <div className="col table-responsive">
                        <table className="table table-striped table-sm">
                            <thead className="">
                                <tr>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Calls Made</th>
                                    <th>Calls Reached</th>
                                    <th>Average Outbound Time</th>
                                    <th>Outbound Time</th>
                                    <th>Cost Of Outbound Calls(NGN)</th>
                                    <th>Orders From Cold Calls(NGN)</th>
                                    <th>No Of Cold Calls Orders</th>
                                    <th>Orders from Existing Customers(NGN)</th>
                                    <th>No of Existing Customers Orders </th>
                                    <th>Total Amount Of Orders Sold(NGN)</th>
                                    <th>No Of Orders Sold</th>
                                    <th>Total Amount Of Orders Generated(NGN)</th>
                                    <th>No Of Orders Generated</th>
                                </tr>
                            </thead>
                            <tbody>{agentKPI && this.renderAgents()}</tbody>
                        </table>
                    </div>
                    

                </div>

            </main>
        );
    }
}

export default React.memo(Page);
