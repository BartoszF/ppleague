import * as React from 'react';

import './matchButton.css';
import { inject, observer } from 'mobx-react';
import { InputNumber, notification } from 'antd';
import _ from 'lodash';
import MatchService from '../../services/MatchService';
import PlayerService from '../../services/PlayerService';
import { APP_NAME } from '../../constants';

@inject('playerStore')
@inject('matchStore')
@inject('userStore')
@observer
class MatchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aScore: 0,
      bScore: 0,
    };

    this.playerAScoreChange = this.playerAScoreChange.bind(this);
    this.playerBScoreChange = this.playerBScoreChange.bind(this);
    this.getButtonText = this.getButtonText.bind(this);
  }

  samePlayerAsMatch(playerId) {
    return this.props.matchStore.ongoingMatch
                && this.props.matchStore.ongoingMatch.playerB
                && (this.props.matchStore.ongoingMatch.playerB.id === playerId || this.props.matchStore.ongoingMatch.playerA.id === playerId);
  }

  isInvitation() {
    const { userStore } = this.props;
    const { selectedPlayer } = this.props.playerStore;
    return selectedPlayer && userStore.matchInvitations.length > 0
      && userStore.matchInvitations.filter(
        (value) => (value.notifier.player.playerId === selectedPlayer.playerId
          && value.notifier.player.playerId !== this.props.userStore.player.playerId)
          || (value.actor.player.playerId === selectedPlayer.playerId
            && value.actor.player.playerId !== this.props.userStore.player.playerId),
                            ).length > 0;
  }

  onClick(ev) {
    if (this.isInvitation()) {
      return;
    }

    if (
      this.samePlayerAsMatch(this.props.playerStore.selectedPlayer.playerId)
    ) {
      if (this.state.aScore === this.state.bScore) {
        notification.error({
          message: APP_NAME,
          description: 'Enter proper score!',
        });
        return;
      }
      MatchService.endMatch(this.state.aScore, this.state.bScore, this.props.matchStore.ongoingMatch.id)
        .then((response) => {
          this.props.matchStore.ongoingMatch = null;
          this.props.userStore.getMatchInvitations();
          this.setState({
            aScore: 0,
            bScore: 0
          });
          PlayerService.getPlayers()
            .then((response) => {
              this.props.playerStore.setPlayers(response);
            });
        })
        .catch((err) => {
          notification.error({
            message: APP_NAME,
            description: 'Something went wrong',
          });
          console.log(err);
        });

      return;
    }

    const match = {};
    match.playerAId = this.props.playerStore.userPlayer.playerId;
    match.playerBId = this.props.playerStore.selectedPlayer.playerId;

    MatchService.createInvitation(match)
      .then(() => {
        this.props.userStore.getMatchInvitations();
        notification.success({
          message: APP_NAME,
          description: 'Invitation sent.',
        });
      })
      .catch((err) => {
        notification.error({
          message: APP_NAME,
          description: err.debugMessage,
        });
        console.log(err);
      });
  }

  playerAScoreChange(score) {
    this.setState({ aScore: score });
  }

  playerBScoreChange(score) {
    this.setState({ bScore: score });
  }

  getNames() {
    const { selectedPlayer } = this.props.playerStore;
    const { ongoingMatch } = this.props.matchStore;
    if (selectedPlayer && this.samePlayerAsMatch(selectedPlayer.playerId) && ongoingMatch && _.has(ongoingMatch, 'playerA')) {
      return (
        <div className="names">
          <span>{ongoingMatch.playerA.user.username}</span>
          <span>{ongoingMatch.playerB.user.username}</span>
        </div>
      );
    }
  }

  getInputs() {
    const { selectedPlayer } = this.props.playerStore;
    if (selectedPlayer && this.samePlayerAsMatch(selectedPlayer.playerId)) {
      return (
        <div className="inputs">
          <InputNumber
            defaultValue={0}
            min={0}
            size="large"
            onChange={this.playerAScoreChange}
          />
          <InputNumber
            defaultValue={0}
            min={0}
            size="large"
            onChange={this.playerBScoreChange}
          />
        </div>
      );
    }
  }

  getButtonText() {
    const { selectedPlayer } = this.props.playerStore;
    if (selectedPlayer && this.samePlayerAsMatch(selectedPlayer.playerId)) {
      return 'END MATCH';
    }

    if (this.isInvitation()) {
      return 'Invitation waiting';
    }

    return 'MATCH';
  }

  render() {
    const { selectedPlayer } = this.props.playerStore;
    return (
      <div className="matchButton">
        {this.getNames()}
        {this.getInputs()}
        <div
          onClick={this.onClick.bind(this)}
          className={
            `button ${
              selectedPlayer && this.samePlayerAsMatch(
                selectedPlayer.playerId,
              )
                ? 'endMatch'
                : 'createMatch'}`
                    }
        >
          {this.getButtonText()}
        </div>
      </div>
    );
  }
}

export default MatchButton;
