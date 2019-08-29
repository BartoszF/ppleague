import {observable, action} from "mobx";

class UserStore {
    @observable username = ""
    @observable email = ""
    @observable id = 0
    @observable player = {}
    @observable isAuthenticated = false

    @action setUser(user) {

        this.id = user.id;
        this.username = user.name;
        this.email = user.email;
        this.isAuthenticated = true;
        this.player = user.player;
    }

    getUserString() {
        return this.id + " " + this.username + " " + this.isAuthenticated;
    }
}

export default new UserStore();
