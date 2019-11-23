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

    getIcons(isOngoing) {
        let icons = []
        if (isOngoing)
            icons.push(<Icon height={'30px'} type="hourglass"/>);
        //<Icon type="clock-circle" />

        return icons;
    }

    render() {
        const {matchStore} = this.props
        const isOngoing = matchStore  &&
                    matchStore.ongoingMatch  &&
                    this.props.userStore.player.playerId != this.props.player.playerId &&
                    [matchStore.ongoingMatch.playerA.id , matchStore.ongoingMatch.playerB.id].includes(this.props.player.playerId)
        return (
            <div key={this.props.player.playerId} onClick={(ev) => this.props.click(ev, this.props.player)}
                 className={"playerListItem " + (isOngoing ? "ongoing" : "")}>
                <span className={"rank"}><h2>{this.props.player.standing} </h2></span>
                <span className={"icons"}>{this.getIcons(isOngoing)}</span>
                <span className={"name"}><h2>{this.props.player.name}</h2></span>
            </div>)
    }
}

export default PlayerListItem