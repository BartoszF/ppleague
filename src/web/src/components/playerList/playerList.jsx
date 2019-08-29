import * as React from "react";
import PlayerListItem from "./playerListItem";
import { observer } from "mobx-react";
import './playerList.css';

@observer
class PlayerList extends React.Component {

    constructor(props){
        super(props);
    }

    onClick(ev, player) {
        console.log("clicked " + ev + " " + player.name)
        this.props.playerStore.selectPlayer(player);
    }

    render() {
        return (
            <div className={"playerList"}>
                {this.props.players.map((player, index) => {
                    return <PlayerListItem click={this.onClick.bind(this)} key={player.id} player={player} />
                })}
            </div>
        )
    }
}

export default PlayerList;