import * as React from "react";
import {inject, observer} from "mobx-react";
import PlayerList from "../../components/playerList/playerList";
import PlayerService from "../../services/PlayerService";
import {Col} from "antd";

import './ladderPage.css';
import PlayerPane from "../../components/playersPane/playerPane";

@inject('playerStore') @inject('userStore') @observer
class LadderPage extends React.Component {

    componentDidMount() {
        this.props.playerStore.selectPlayer(null);
        PlayerService.getPlayers().then((response) => {
            this.props.playerStore.setPlayers(response);
        })
    }

    render() {
        return (
            <div className="ladderContent" style={{height: "100%"}}>
                <Col style={{height: "100%"}} span={5}>
                    <PlayerList players={this.props.playerStore.players}/>
                </Col>
                <Col style={{height: "100%"}} span={14}>
                    <PlayerPane player={this.props.playerStore.userPlayer}/>
                    <PlayerPane player={this.props.playerStore.selectedPlayer} other={true}/>
                </Col>
            </div>
        )
    }
}

export default LadderPage;