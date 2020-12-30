import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const displayName = "Conversation";
const propTypes = {
    conversations: PropTypes.array.isRequired
};

const Conversation = ({ conversations }) => {
    return (
        <div className="chat-box">
            <div className="chat-heading pane-theme">Conversation</div>
            <div className="chat-body">
                <div className="chat-body-overlay">
                    <div className="chat-messages">
                        {conversations.map((convo, index) => {
                            return (
                                <div
                                    key={index}
                                    className={
                                        convo.direction == "IN"
                                            ? "message in clearfix"
                                            : "message out clearfix"
                                    }
                                >
                                    <header>
                                        Agent: {convo.agent} User:{" "}
                                        {convo.userName}
                                    </header>
                                    <article>
                                        Response: {convo.action}
                                        <br />
                                        {convo.actionDetails}
                                    </article>
                                    <span className="time">
                                        {convo.createdAt}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

Conversation.displayName = displayName;
Conversation.propTypes = propTypes;

export default React.memo(Conversation);
