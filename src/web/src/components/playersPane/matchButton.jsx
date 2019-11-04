import * as React from "react";

import "./matchButton.css";
import {inject, observer} from "mobx-react";
import MatchService from "../../services/MatchService";
import MatchScoreModal from "../common/matchScoreModal";
import {InputNumber} from "antd";

@inject("playerStore")
@inject("matchStore")
@observer
class MatchButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {modal: false};
    }

    samePlayerAsMatch(playerId) {
        return this.props.matchStore.ongoingMatch.playerB && this.props.matchStore.ongoingMatch.playerB.id === playerId;
    }

    onClick(ev) {
        if (
            this.samePlayerAsMatch(this.props.playerStore.selectedPlayer.playerId)
        ) {
            this.showModal();
            return;
        }

        let match = {};
        match.playerAId = this.props.playerStore.userPlayer.playerId;
        match.playerBId = this.props.playerStore.selectedPlayer.playerId;

        MatchService.createMatch(match)
            .then(response => {
                this.props.matchStore.ongoingMatch = response;
            })
            .catch(err => {
                console.log(err);
            });
    }

    showModal = () => {
        this.setState({
            modal: true
        });
    };

    getInputs() {
        if (this.samePlayerAsMatch(this.props.playerStore.selectedPlayer.playerId)) {
            return <div style={{position: 'absolute'}}>
                <InputNumber
                    defaultValue={0}
                    min={0}
                    size={"large"}
                    onChange={this.playerAScoreChange}
                />
            </div>
        }
    }

    render() {
        return (
            <div>
                {this.getInputs()}
                <div
                    onClick={this.onClick.bind(this)}
                    className={
                        "matchButton " +
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
                    <MatchScoreModal
                        visible={this.state.modal}
                    />
                </div>
            </div>
        );
    }
}

export default MatchButton;
