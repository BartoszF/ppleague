import {observable, action} from "mobx";

import UserService from "../services/UserService";

class UserStore {
    @observable username = ""
    @observable email = ""
    @observable id = 0
    @observable player = {}
    @observable notifications = []
    @observable isAuthenticated = false

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

    @action removeNotification(notification) {
        this.notifications = this.notifications.filter(item => item !== notification)
    }

    @action
    getNotifications() {
        UserService.getNotifications().then(
            action('setNotifications', notifications => {
                this.setNotifications(notifications);
            }),
            action('error', error => {
                console.log(error);
            })
         )
    }

    getUserString() {
        return this.id + " " + this.username + " " + this.isAuthenticated;
    }

}

export default new UserStore();
