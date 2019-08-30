
import * as React from "react";

import './matchButton.css';
import { inject, observer } from "mobx-react";
import MatchService from "../../services/MatchService";

@inject('playerStore') @inject('matchStore') @observer
class MatchButton extends React.Component {
    
    onClick(ev) {
        console.log(this.props.playerStore.selectedPlayer.playerId);
        console.log(this.props.playerStore.userPlayer.playerId);

        let match = {}
        match.playerAId = this.props.playerStore.userPlayer.playerId;
        match.playerBId = this.props.playerStore.selectedPlayer.playerId;

        MatchService.createMatch(match).then((response) => {
            this.props.matchStore.ongoingMatch = response;
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div onClick={this.onClick.bind(this)} className={"matchButton"}>
                MATCH
            </div>
        )
    }
}

export default MatchButton;