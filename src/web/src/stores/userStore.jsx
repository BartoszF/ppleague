import { action, observable } from 'mobx';

import UserService from '../services/UserService';
import NotificationService from '../services/NotificationService';

class UserStore {
    @observable username = '';

    @observable email = '';

    @observable id = 0;

    @observable player = {};

    @observable notifications = [];

    @observable isAuthenticated = false;

    @observable matchInvitations = [];

    @action setUser(user) {
        this.id = user.id;
        this.username = user.name;
        this.email = user.email;
        this.isAuthenticated = true;
        this.player = user.player;
        this.notifications = [];
    }

    @action setNotifications(notifications) {
        this.notifications = notifications.notifications;
    }

    @action
    addNotification(notification) {
        switch (notification.eventType) {
            case 'MATCH_INV':
                notification.title = 'New match invitation!';
                notification.message = `${notification.actor.name} invited you for a match`;
                break;
            case 'MATCH_CANCEL':
                notification.title = 'New match cancelation';
                notification.message = `${notification.actor.name} wants to cancel a match with you`;
                break;
            default:
                break;
        }

        this.notifications.push(notification);

        return notification;
    }

    @action removeNotification(notification) {
        this.notifications = this.notifications.filter((item) => item !== notification);
    }

    @action
    getNotifications() {
        UserService.getNotifications()
          .then(
            action('setNotifications', (notifications) => {
                notifications.notifications.forEach((value, index) => {
                    this.addNotification(value);
                });
                // this.setNotifications(notifications);
            }),
            action('error', (error) => {
                console.log(error);
            }),
          );
    }

    @action
    getMatchInvitations() {
        this.matchInvitations = [];
        NotificationService.getInvitations()
          .then(
            action('setInvitations', (invitations) => {
                invitations.notifications.forEach((value, index) => {
                    this.matchInvitations.push(value);
                });
            }),
            action('error', (error) => {
                console.log(error);
            }),
          );
    }

    getUserString() {
        return `${this.id} ${this.username} ${this.isAuthenticated}`;
    }
}

export default new UserStore();
