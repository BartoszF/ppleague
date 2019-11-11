import React from "react";
import { Button, notification } from "antd";
import { inject, observer } from "mobx-react";

import "./notification.css";
import MatchService from "../../services/MatchService";
import NotificationService from "../../services/NotificationService";

import {APP_NAME} from "../../constants";

@inject("matchStore")
@inject("userStore")
@observer
class Notification extends React.Component {
    constructor(props) {
      super(props);

        this.state = {
            acceptLoading: false,
            rejectLoading: false
        }
        this.acceptNotification = this.acceptNotification.bind(this);
        this.rejectNotification = this.rejectNotification.bind(this);
    }

    acceptNotification(ev) {
        this.setState({acceptLoading: true});
        let notificationObj = this.props.notification;

        MatchService.acceptInvitation(notificationObj.id)
            .then((response) => {
               this.props.matchStore.setOngoingMatch(response);
               this.props.userStore.removeNotification(notificationObj);
               this.setState({acceptLoading: false});
               notification.success({
                   message: APP_NAME,
                   description: "Invitation accepted."
               });
            }).catch(err => {
               this.setState({acceptLoading: false});
               notification.error({
                  message: APP_NAME,
                  description: err.message
              });
            });

    }

    rejectNotification(ev) {
        this.setState({rejectLoading: true});
        let notificationObj = this.props.notification;

        NotificationService.rejectNotification(notificationObj.id)
                    .then((response) => {
                       this.props.userStore.removeNotification(notificationObj);
                       notification.success({
                           message: APP_NAME,
                           description: "Invitation rejected."
                       });
                       this.setState({rejectLoading: false});
                    }).catch(err => {
                       this.setState({rejectLoading: false});
                       notification.error({
                          message: APP_NAME,
                          description: err.message
                      });
                    });
    }

    render() {
        return (<div key={this.props.notification.id} className="notification-element">
                   <div className="title">
                       {this.props.notification.eventType}
                   </div>
                   <div className="message">
                       {this.props.notification.actor.username}
                   </div>
                   <div className="controls">
                       <Button onClick={this.acceptNotification} loading={this.state.acceptLoading} type="primary" size={"small"}>
                           Accept
                       </Button>
                       <Button onClick={this.rejectNotification} loading={this.state.rejectLoading} type="danger" size={"small"}>
                           Reject
                       </Button>
                   </div>
               </div>);
    }

}

export default Notification;