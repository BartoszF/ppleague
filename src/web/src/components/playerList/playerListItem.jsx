import * as React from "react";
import {Icon} from 'antd';
import {inject, observer} from "mobx-react";
import "./PlayerListItem.css";

import _ from 'lodash';

@inject('userStore')
@inject('matchStore')
@observer
class PlayerListItem extends React.Component {

    isOngoing(playerId) {
        return !_.isEmpty(this.props.matchStore.ongoingMatch) && this.props.userStore.player.playerId != playerId &&(this.props.matchStore.ongoingMatch.playerA.id == playerId || this.props.matchStore.ongoingMatch.playerB.id == playerId)
    }

    getIcons() {
        let icons = []
        if (this.isOngoing(this.props.player.playerId))
            icons.push(<Icon height={'30px'} type="hourglass"/>);
        //<Icon type="clock-circle" />

        return icons;
    }

    render() {
        return (
            <div key={this.props.player.playerId} onClick={(ev) => this.props.click(ev, this.props.player)}
                 className={"playerListItem " + (this.isOngoing(this.props.player.playerId) ? "ongoing" : "")}>
                <span className={"rank"}><h2>{this.props.player.standing} </h2></span>
                <span className={"icons"}>{this.getIcons()}</span>
                <span className={"name"}><h2>{this.props.player.name}</h2></span>
            </div>)
    }
}

export default PlayerListItem