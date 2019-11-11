import * as React from "react";
import {observer} from "mobx-react";
import "./PlayerListItem.css";

@observer
class PlayerListItem extends React.Component {

    render() {
        return (
            <div key={this.props.player.playerId} onClick={(ev) => this.props.click(ev,this.props.player)} className={"playerListItem"}>
                <span className={"rank"}><h2>{this.props.player.standing} </h2></span>
                <span className={"name"}><h2>{this.props.player.name}</h2></span>
            </div>)
    }
}

export default PlayerListItem