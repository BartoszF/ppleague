import * as React from "react";
import PlayerListItem from "./playerListItem";


export default class PlayerList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: props.players
        }
    }

    render() {
        return (
            <div>
                {this.state.players.map((player, index) => {
                    return <PlayerListItem id={player.id} player={player} />
                })}
            </div>
        )
    }
}