import {action, observable} from "mobx";
import PlayerService from "../services/PlayerService";
import {notification} from "antd";
import {APP_NAME} from "../constants";

class PlayerStore {
    @observable players = []
    @observable selectedPlayer = {}
    @observable userPlayer = {}

    @action setPlayers(players) {
        this.players = [];

        players.sort((a, b) => {
            return b.rating - a.rating;
        })

        players.forEach((element, index) => {
            element.standing = index + 1;
            this.players.push(element);

            if (element.playerId === this.userPlayer.playerId) {
                this.userPlayer = element;
            }

            if (this.selectedPlayer != null && element.playerId === this.selectedPlayer.playerId) {
                this.selectedPlayer = element;
            }
        });

        this.players.forEach((element, index) => {
            element.isLoading = true;

            PlayerService.getMatches(element.playerId).then(
                action('getMatches', (matches) => {
                    if (element.playerId === this.userPlayer.playerId) {
                        this.userPlayer.matches = matches;
                        this.userPlayer.isLoading = false;
                    }

                    if (this.selectedPlayer != null && element.playerId === this.selectedPlayer.playerId) {
                        this.selectedPlayer.matches = matches;
                        this.selectedPlayer.isLoading = false;
                    }
                    element.matches = matches;
                    element.isLoading = false;
                }),
                action('error', (err) => {
                    element.isLoading = false;
                    notification.error({
                        message: APP_NAME,
                        description:
                            "Couldn't get matches of player!"
                    });
                })
            );
        })
    }

    @action selectPlayer(player) {
        this.selectedPlayer = player;

        if (this.selectedPlayer == null) return;

    }

    @action setUserPlayer(player) {
        this.userPlayer = player;
    }
}

export default new PlayerStore()
