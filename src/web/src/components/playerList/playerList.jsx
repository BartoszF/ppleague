import * as React from "react";
import PlayerListItem from "./playerListItem";
import { observer, inject } from "mobx-react";
import './playerList.css';
import MatchService from "../../services/MatchService";

@inject('matchStore') @inject('playerStore') @observer
class PlayerList extends React.Component {

    onClick(ev, player) {
        if(player.playerId === this.props.playerStore.userPlayer.playerId)
        {
            return;
        }
        this.props.playerStore.selectPlayer(player);

        this.props.matchStore.selectedPlayerLoading = true;
        MatchService.getMatchByPlayer(this.props.playerStore.selectedPlayer).then((response) => {
            this.props.matchStore.setSelectedPlayerMatches(response);
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        return (
            <div className={"playerList"}>
                {this.props.players.map((player, index) => {
                    return <PlayerListItem click={this.onClick.bind(this)} player={player} />
                })}
            </div>
        )
    }
}

export default PlayerList;