import * as React from "react";
import { Icon } from 'antd';
import {observer, inject} from "mobx-react";
import "./PlayerListItem.css";

import _ from 'lodash';

@inject('userStore')
@inject('matchStore')
@observer
class PlayerListItem extends React.Component {

    isOngoing(playerId) {
        return !_.isEmpty(this.props.matchStore.ongoingMatch) && this.props.userStore.player.playerId != playerId &&(this.props.matchStore.ongoingMatch.playerA.id == playerId || this.props.matchStore.ongoingMatch.playerB.id == playerId)
    }

    render() {
        return (
            <div key={this.props.player.playerId} onClick={(ev) => this.props.click(ev,this.props.player)} className={"playerListItem"}>
                <span className={"rank"}><h2>{this.props.player.standing} </h2></span>
                <span className={"icons"}>{this.isOngoing(this.props.player.playerId) ? <Icon height={'30px'} type="hourglass" /> : ""}</span>
                <span className={"name"}><h2>{this.props.player.name}</h2></span>
            </div>)
    }
}

export default PlayerListItem