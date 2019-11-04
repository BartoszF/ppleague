import {observable, action} from "mobx";

class PlayerStore {
    @observable players = []
    @observable selectedPlayer = {}
    @observable userPlayer = {}

    @action setPlayers(players) {
        this.players = [];

        players.sort((a,b) => {
            return b.rating - a.rating;
        })

        players.forEach((element, index) => {
            element.standing = index+1;
            this.players.push(element);
            if(element.playerId === this.userPlayer.playerId)
            {
                this.userPlayer = element;
            }

            if(this.selectedPlayer != null && element.playerId === this.selectedPlayer.playerId)
            {
                this.selectedPlayer = element;
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
