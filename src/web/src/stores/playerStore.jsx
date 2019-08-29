import {observable, action} from "mobx";

class PlayerStore {
    @observable players = []
    @observable selectedPlayer = {}

    @action setPlayers(players) {
        players.forEach(element => {
            this.players.push(element);
        });
    }

    @action selectPlayer(player) {
        this.selectedPlayer = player;
    }
}

export default new PlayerStore()
