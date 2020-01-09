import * as React from 'react';
import { inject, observer } from 'mobx-react';
import PlayerListItem from './playerListItem';
import './playerList.css';
import MatchService from '../../services/MatchService';
import { Input } from 'antd';

@inject('matchStore') @inject('playerStore') @observer
class PlayerList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };
  }

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

  onSearchChange = (e) => {
    this.setState({ search: e.target.value });
  };

  filterPlayers(value) {
    const { search } = this.state;
    if (search.length >= 3) {
      if (value.name.toLowerCase()
        .includes(search.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  render() {
    const { players } = this.props;
    return (
      <div className="playerListContainer">
        <Input onChange={this.onSearchChange} placeholder='Username'/>
        <div className="playerList">
          {players.filter(this.filterPlayers.bind(this))
            .map((player, index) => (
              <PlayerListItem
                key={player.playerId}
                public={this.props.public}
                click={this.onClick.bind(this)}
                player={player}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default PlayerList;
