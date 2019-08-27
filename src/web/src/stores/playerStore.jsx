import {observable, action} from "mobx";

class PlayerStore {
    @observable players = []

    @action setPlayers(players) {
        players.forEach(element => {
            this.players.push(element);
        });
    }
}

export default new PlayerStore()
