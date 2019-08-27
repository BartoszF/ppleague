import * as React from "react";
import PlayerListItem from "./playerListItem";
import { inject, observer } from "mobx-react";
import PlayerService from "../../services/PlayerService";


@observer @inject('playerStore')
class PlayerList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: props.players
        }
    }

    componentDidMount() {
        PlayerService.getPlayers().then((response) => {
            this.props.playerStore.setPlayers(response);
        })
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

export default PlayerList;