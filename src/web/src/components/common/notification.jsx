import React from 'react';
import { Button, notification } from 'antd';
import { inject, observer } from 'mobx-react';

import './notification.css';
import MatchService from '../../services/MatchService';
import NotificationService from '../../services/NotificationService';

import { APP_NAME } from '../../constants';

@inject('matchStore')
@inject('userStore')
@observer
class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptLoading: false,
      rejectLoading: false,
    };
    this.acceptNotification = this.acceptNotification.bind(this);
    this.rejectNotification = this.rejectNotification.bind(this);
  }

  acceptNotification(ev) {
    this.setState({ acceptLoading: true });
    const notificationObj = this.props.notification;

    switch (notificationObj.eventType) {
      case 'MATCH_INV':
        MatchService.acceptInvitation(notificationObj.id)
          .then((response) => {
            this.props.matchStore.setOngoingMatch(response);
            notification.success({
              message: APP_NAME,
              description: 'Invitation accepted.',
            });
            this.props.userStore.removeNotification(notificationObj);
          })
          .catch((err) => {
            this.setState({ acceptLoading: false });
            notification.error({
              message: APP_NAME,
              description: err.message,
            });
          });

        break;
      case 'MATCH_CANCEL':
        // TODO Move from store to here (whole promise)
        MatchService.acceptMatchCancel(notificationObj.eventId)
          .then(() => {
            this.props.matchStore.setOngoingMatch(null);
            notification.success({
              message: APP_NAME,
              description: 'Match cancelled',
            });
            this.props.userStore.removeNotification(notificationObj);
          })
          .catch((err) => {
          });
        break;
      default:
        break;
    }
  }

  rejectNotification(ev) {
    this.setState({ rejectLoading: true });
    const notificationObj = this.props.notification;

    NotificationService.rejectNotification(notificationObj.id)
      .then((response) => {
        notification.success({
          message: APP_NAME,
          description: 'Invitation rejected.',
        });

        this.props.userStore.removeNotification(notificationObj);
      })
      .catch((err) => {
        this.setState({ rejectLoading: false });
        notification.error({
          message: APP_NAME,
          description: err.message,
        });
      });
  }

  render() {
    return (
      <div key={this.props.notification.id} className="notification-element">
        <div className="title">
          <h4>{this.props.notification.title}</h4>
        </div>
        <div className="message">
          {this.props.notification.message}
        </div>
        <div className="controls">
          <Button onClick={this.acceptNotification} loading={this.state.acceptLoading}
                  type="primary" size="small">
                           Accept
          </Button>
          <Button onClick={this.rejectNotification} loading={this.state.rejectLoading} type="danger"
                  size="small">
                           Reject
          </Button>
        </div>
      </div>
    );
  }
}

export default Notification;
