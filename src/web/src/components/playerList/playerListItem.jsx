import * as React from "react";
import {Icon} from 'antd';
import {inject, observer} from "mobx-react";
import {computed} from 'mobx';
import "./PlayerListItem.css";

import _ from 'lodash';

@inject('userStore')
@inject('matchStore')
@observer
class PlayerListItem extends React.Component {

    isOngoing(matchStore) {
        return matchStore != null && matchStore.ongoingMatch != null && this.props.userStore.player.playerId != this.props.player.playerId &&(matchStore.ongoingMatch.playerA.id == this.props.player.playerId || matchStore.ongoingMatch.playerB.id == this.props.player.playerId)
    }

    getIcons(matchStore) {
        let icons = []
        if (this.isOngoing(matchStore))
            icons.push(<Icon height={'30px'} type="hourglass"/>);
        //<Icon type="clock-circle" />

        return icons;
    }

    render() {
        return (
            <div key={this.props.player.playerId} onClick={(ev) => this.props.click(ev, this.props.player)}
                 className={"playerListItem " + (this.isOngoing(this.props.matchStore) ? "ongoing" : "")}>
                <span className={"rank"}><h2>{this.props.player.standing} </h2></span>
                <span className={"icons"}>{this.getIcons(this.props.matchStore)}</span>
                <span className={"name"}><h2>{this.props.player.name}</h2></span>
            </div>)
    }
}

export default PlayerListItem