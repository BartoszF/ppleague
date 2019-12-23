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
  matchButton() {
    if (!this.props.isPublic && _.has(this.props, 'other') && this.props.other === true) {
      return (
        <MatchButton/>);
    }
  }

  cancelMatch() {
    MatchService.cancelMatch(this.props.matchStore.ongoingMatch.id)
      .then(() => {
        notification.success({
          message: APP_NAME,
          description: 'Other user was asked to cancel a match',
        });
      })
      .catch((error) => {
        notification.error({
          message: APP_NAME,
          description: 'Error while sending request',
        });
      });
  }

  cancelButton() {
    if (!this.props.isPublic && this.props.other && this.samePlayerAsMatch(this.props.player.playerId)) {
      return (
        <div title="Cancel match" className="cancelMatchButton">
          <Button
            onClick={this.cancelMatch.bind(this)}
            type="link"
          >
            <Icon type="close"/>
          </Button>
        </div>
      );
    }
  }

  samePlayerAsMatch(playerId) {
    return this.props.matchStore.ongoingMatch
      && this.props.matchStore.ongoingMatch.playerB
      && (this.props.matchStore.ongoingMatch.playerB.id === playerId || this.props.matchStore.ongoingMatch.playerA.id === playerId);
  }

  getMatches() {
    return (
      <h3>
        Matches: W
        {this.props.player.matches != null ? this.props.player.matches.won : '_'}
        {' '}
        /
        L
        {this.props.player.matches != null ? this.props.player.matches.lost : '_'}
      </h3>
    );
  }

  publicMatchHistory() {
    const { isPublic, player } = this.props;

    if (!isPublic) return;

    return (
      <MatchHistory player={player} isLoading={false}/>
    );
  }

  render() {
    const { player } = this.props;

    if (_.isEmpty(player)) {
      return <div className="playerPane"/>;
    }
    return (
      <div className="playerPane">
        <div className="playerImage">
          <Avatar size={82} icon="user"/>
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

PlayerPane.propTypes = {
  player: PropTypes.objectOf(PropTypes.object),
  isPublic: PropTypes.bool,
  other: PropTypes.objectOf(PropTypes.object),
  matchStore: PropTypes.objectOf(PropTypes.object).isRequired,
};

PlayerPane.defaultProps = {
  isPublic: false,
  other: {},
  player: {},
};

export default PlayerPane;
