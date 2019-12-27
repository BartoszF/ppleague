import * as React from 'react';

import './matchButton.css';
import PropTypes from 'prop-types';
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

  getButtonText() {
    const { playerStore } = this.props;
    const { selectedPlayer } = playerStore;
    if (selectedPlayer && this.samePlayerAsMatch(selectedPlayer.playerId)) {
      return 'END MATCH';
    }

    if (this.isInvitation()) {
      return 'Invitation waiting';
    }

    return 'MATCH';
  }

  getNames() {
    const { playerStore, matchStore } = this.props;
    const { selectedPlayer } = playerStore;
    const { ongoingMatch } = matchStore;
    if (selectedPlayer && this.samePlayerAsMatch(selectedPlayer.playerId) && ongoingMatch && _.has(ongoingMatch, 'playerA')) {
      return (
        <div className="names">
          <span>{ongoingMatch.playerA.user.username}</span>
          <span>{ongoingMatch.playerB.user.username}</span>
        </div>
      );
    }
  }


  onClick(ev) {
    const { aScore, bScore } = this.state;
    const { playerStore, matchStore, userStore } = this.props;
    const { selectedPlayer } = playerStore;
    let { ongoingMatch } = matchStore;

    if (this.isInvitation()) {
      return;
    }

    if (
      this.samePlayerAsMatch(selectedPlayer.playerId)
    ) {
      if (aScore === bScore) {
        notification.error({
          message: APP_NAME,
          description: 'Enter proper score!',
        });
        return;
      }
      MatchService.endMatch(aScore, bScore, ongoingMatch.id)
        .then(() => {
          ongoingMatch = null;
          userStore.getMatchInvitations();
          this.setState({
            aScore: 0,
            bScore: 0,
          });
          PlayerService.getPlayers()
            .then((response) => {
              playerStore.setPlayers(response);
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
    match.playerAId = playerStore.userPlayer.playerId;
    match.playerBId = selectedPlayer.playerId;

    MatchService.createInvitation(match)
      .then(() => {
        userStore.getMatchInvitations();
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

  getInputs() {
    const { playerStore } = this.props;
    const { selectedPlayer } = playerStore;
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

    return '';
  }

  samePlayerAsMatch(playerId) {
    const { matchStore } = this.props;
    const { ongoingMatch } = matchStore;
    return ongoingMatch
            && ongoingMatch.playerB
            && (ongoingMatch.playerB.id === playerId || ongoingMatch.playerA.id === playerId);
  }

  isInvitation() {
    const { userStore, playerStore } = this.props;
    const { selectedPlayer } = playerStore;

    return selectedPlayer && userStore.matchInvitations.length > 0
      && userStore.matchInvitations.filter(
        (value) => (value.notifier.player.playerId === selectedPlayer.playerId
          && value.notifier.player.playerId !== userStore.player.playerId)
          || (value.actor.player.playerId === selectedPlayer.playerId
            && value.actor.player.playerId !== userStore.player.playerId),
      ).length > 0;
  }

  playerAScoreChange(score) {
    this.setState({ aScore: score });
  }

  playerBScoreChange(score) {
    this.setState({ bScore: score });
  }

  render() {
    const { playerStore } = this.props;
    const { selectedPlayer } = playerStore;
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

MatchButton.propTypes = {
  player: PropTypes.objectOf(PropTypes.object),
  playerStore: PropTypes.objectOf(PropTypes.object),
  userStore: PropTypes.objectOf(PropTypes.object),
  matchStore: PropTypes.objectOf(PropTypes.object),
};

// MatchButton.defaultProps = {
//   player: {},
//   playerStore: {},
//   userStore: {},
//   matchStore: {},
// };

export default MatchButton;
