import {observable, action} from "mobx";

class PlayerStore {
    @observable players = []
    @observable selectedPlayer = {}
    @observable userPlayer = {}

    @action setPlayers(players) {
        players.sort((a,b) => {
            return b.rating - a.rating;
        })

        players.forEach((element, index) => {
            element.standing = index+1;
            this.players.push(element);
            if(element.playerId === this.userPlayer.playerId)
            {
                this.userPlayer.standing = element.standing;
            }
        });
    }

    @action selectPlayer(player) {
        this.selectedPlayer = player;
    }

    @action setUserPlayer(player) {
        this.userPlayer = player;
    }
}

export default new PlayerStore()
