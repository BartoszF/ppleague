import * as React from 'react';
import { inject, observer } from 'mobx-react';
import PlayerListItem from './playerListItem';
import './playerList.css';
import MatchService from '../../services/MatchService';

@inject('matchStore') @inject('playerStore') @observer
class PlayerList extends React.Component {
  onClick(ev, player) {
    if (!this.props.public && player.playerId === this.props.playerStore.userPlayer.playerId) {
      return;
    }
    this.props.playerStore.selectPlayer(player);

    this.props.matchStore.selectedPlayerLoading = true;
    MatchService.getMatchByPlayer(this.props.playerStore.selectedPlayer)
      .then((response) => {
        this.props.matchStore.setSelectedPlayerMatches(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="playerList">
        {this.props.players.map((player, index) => (
          <PlayerListItem key={player.playerId}
            public={this.props.public}
            click={this.onClick.bind(this)}
            player={player} />
        ))}
      </div>
    );
  }
}

export default PlayerList;
