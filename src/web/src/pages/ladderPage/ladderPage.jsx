import * as React from "react";
import {inject, observer} from "mobx-react";
import playerStore from "../../stores/playerStore";
import Player from "../../stores/player";
import PlayerList from "../../components/playerList/playerList";

@inject('playerStore') @observer
class LadderPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.playerStore.players = [
            new Player(1, "test", 1001, 0.23, 1),
            new Player(2, "test2", 1002, 0.24, 2)
        ]
    }
    componentDidMount() {

    }

    render() {
        return (
            <div>
                <PlayerList players={this.props.playerStore.players}/>
            </div>
        )
    }
}

export default LadderPage;