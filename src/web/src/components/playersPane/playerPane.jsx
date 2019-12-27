import * as React from 'react';
import PropTypes from 'prop-types';
import './playerPane.css';
import _ from 'lodash';
import { Avatar, Button, Icon, notification, } from 'antd';

import { inject, observer } from 'mobx-react';
import { APP_NAME } from '../../constants';

import MatchButton from './matchButton';
import MatchHistory from '../userInfo/matchHistory';

import MatchService from '../../services/MatchService';

@inject('matchStore')
@observer
class PlayerPane extends React.Component {

  getMatches() {
    const { player } = this.props;
    const { matches } = player;
    return (
      <h3>
        Matches: W
        {matches != null ? matches.won : '_'}
        {' '}
        /
        L
        {matches != null ? matches.lost : '_'}
      </h3>
    );
  }

  samePlayerAsMatch(playerId) {
    const { matchStore } = this.props;
    const { ongoingMatch } = matchStore;
    return ongoingMatch
      && ongoingMatch.playerB
      && (ongoingMatch.playerB.id === playerId || ongoingMatch.playerA.id === playerId);
  }

  cancelButton() {
    const { isPublic, other, player } = this.props;

    if (!isPublic && other && this.samePlayerAsMatch(player.playerId)) {
      return (
        <div title="Cancel match" className="cancelMatchButton">
          <Button
            onClick={this.cancelMatch.bind(this)}
            type="link"
          >
            <Icon type="close" />
          </Button>
        </div>
      );
    }

    return '';
  }

  cancelMatch() {
    const { matchStore } = this.props;
    const { ongoingMatch } = matchStore;
    MatchService.cancelMatch(ongoingMatch.id)
      .then(() => {
        notification.success({
          message: APP_NAME,
          description: 'Other user was asked to cancel a match',
        });
      })
      .catch(() => {
        notification.error({
          message: APP_NAME,
          description: 'Error while sending request',
        });
      });
  }

  matchButton() {
    const { isPublic, other } = this.props;

    if (!isPublic && _.has(this.props, 'other') && other === true) {
      return (
        <MatchButton />);
    }

    return '';
  }

  publicMatchHistory() {
    const { isPublic, player } = this.props;

    if (!isPublic) return '';

    return (<MatchHistory player={player} isLoading={false} />);
  }

  render() {
    const { player } = this.props;

    if (_.isEmpty(player)) {
      return <div className="playerPane" />;
    }
    return (
      <div className="playerPane">
        <div className="playerImage">
          <Avatar size={82} icon="user" />
        </div>
        <div className="playerName">
          #
          {`${player.standing} `}
          {player.name}
        </div>
        <div className="playerRating">
          <h2>
            Rating:
            {parseFloat(player.rating)
              .toFixed(2)}
          </h2>
          {this.getMatches()}
        </div>

        {/* this.publicMatchHistory() */}
        {this.matchButton()}
        {this.cancelButton()}
      </div>
    );
  }
}

export default PlayerPane;
