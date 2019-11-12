import * as React from "react";

import "./matchButton.css";
import {inject, observer} from "mobx-react";
import MatchService from "../../services/MatchService";
import PlayerService from "../../services/PlayerService";
import {InputNumber, notification} from "antd";
import _ from "lodash";
import {APP_NAME} from "../../constants";

@inject("playerStore")
@inject("matchStore")
@observer
class MatchButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {aScore: 0, bScore: 0}

        this.playerAScoreChange = this.playerAScoreChange.bind(this);
        this.playerBScoreChange = this.playerBScoreChange.bind(this);
    }

    samePlayerAsMatch(playerId) {
        return this.props.matchStore.ongoingMatch
                && this.props.matchStore.ongoingMatch.playerB
                && (this.props.matchStore.ongoingMatch.playerB.id === playerId || this.props.matchStore.ongoingMatch.playerA.id === playerId);
    }

    onClick(ev) {
        if (
            this.samePlayerAsMatch(this.props.playerStore.selectedPlayer.playerId)
        ) {
            console.log(this.state);
            MatchService.endMatch(this.state.aScore, this.state.bScore, this.props.matchStore.ongoingMatch.id)
                .then(response => {
                    console.log(response);
                    this.props.matchStore.ongoingMatch = null;
                    this.setState({aScore: 0, bScore: 0})
                    PlayerService.getPlayers().then((response) => {
                        this.props.playerStore.setPlayers(response);
                    })
                })
                .catch(err => {
                    console.log(err);
                });

            return;
        }

        let match = {};
        match.playerAId = this.props.playerStore.userPlayer.playerId;
        match.playerBId = this.props.playerStore.selectedPlayer.playerId;

        MatchService.createInvitation(match)
            .then(() => {
                //this.props.matchStore.ongoingMatch = response;
                notification.success({
                    message: APP_NAME,
                    description: "Invitation sent."
                });
            })
            .catch(err => {
                notification.error({
                    message: APP_NAME,
                    description: err.debugMessage
                });
                console.log(err);
            });
    }

    playerAScoreChange(score) {
        this.setState({aScore: score});
    }

    playerBScoreChange(score) {
            this.setState({bScore: score});
        }

    getNames()
    {
        if (this.samePlayerAsMatch(this.props.playerStore.selectedPlayer.playerId) && this.props.matchStore.ongoingMatch && _.has(this.props.matchStore.ongoingMatch, 'playerA'))
            return (
                <div className="names">
                    <span>{this.props.matchStore.ongoingMatch.playerA.user.username}</span>
                    <span>{this.props.matchStore.ongoingMatch.playerB.user.username}</span>
                </div>
            )
    }

    getInputs() {
        if (this.samePlayerAsMatch(this.props.playerStore.selectedPlayer.playerId)) {
            return <div className="inputs">
                <InputNumber
                    defaultValue={0}
                    min={0}
                    size={"large"}
                    onChange={this.playerAScoreChange}
                />
                <InputNumber
                    defaultValue={0}
                    min={0}
                    size={"large"}
                    onChange={this.playerBScoreChange}
                />
            </div>
        }
    }

    render() {
        return (
            <div className="matchButton">
                {this.getNames()}
                {this.getInputs()}
                <div
                    onClick={this.onClick.bind(this)}
                    className={
                    "button " +
                        (this.samePlayerAsMatch(
                            this.props.playerStore.selectedPlayer.playerId
                        )
                            ? "endMatch"
                            : "createMatch")
                    }
                >
                    {this.samePlayerAsMatch(this.props.playerStore.selectedPlayer.playerId)
                        ? "END MATCH"
                        : "MATCH"}
                </div>
            </div>
        );
    }
}

export default MatchButton;
