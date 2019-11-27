import * as React from 'react';
import { Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import './PlayerListItem.css';

@inject('userStore')
@inject('matchStore')
@observer
class PlayerListItem extends React.Component {
  getIcons(isOngoing, isInvitation) {
    const icons = [];
    if (this.props.public) return;
    if (isOngoing) icons.push(<Icon key="ongoing" height="20px" type="hourglass"/>);
    if (isInvitation) icons.push(<Icon key="invitation" height="20px" type="clock-circle"/>);

    return icons;
  }

  render() {
    const { matchStore, userStore } = this.props;
    const isOngoing = !this.props.public && matchStore
      && matchStore.ongoingMatch
      && this.props.userStore.player.playerId !== this.props.player.playerId
      && [matchStore.ongoingMatch.playerA.id, matchStore.ongoingMatch.playerB.id].includes(this.props.player.playerId);
    const isInvitation = !this.props.public && userStore
      && userStore.matchInvitations.length > 0
      && userStore.matchInvitations.filter(
        (value) => (value.notifier.player.playerId === this.props.player.playerId
          && value.notifier.player.playerId !== this.props.userStore.player.playerId)
          || (value.actor.player.playerId === this.props.player.playerId
            && value.actor.player.playerId !== this.props.userStore.player.playerId),
                    ).length > 0;
    return (
      <div
        key={this.props.player.playerId}
        onClick={(ev) => this.props.click(ev, this.props.player)}
        className={`playerListItem ${isOngoing ? 'ongoing' : ''}`}
      >
        <span className="rank">
          <h2>
            {this.props.player.standing}
          </h2>
        </span>
        <span className="icons">{this.getIcons(isOngoing, isInvitation)}</span>
        <span className="name"><h2>{this.props.player.name}</h2></span>
      </div>
    );
  }
}

export default PlayerListItem;
