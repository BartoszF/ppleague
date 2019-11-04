import * as React from "react";
import {inject, observer} from "mobx-react";
import PlayerList from "../../components/playerList/playerList";
import PlayerService from "../../services/PlayerService";
import {Col} from "antd";

import _ from 'lodash';


import './ladderPage.css';
import PlayerPane from "../../components/playersPane/playerPane";
import MatchButton from "../../components/playersPane/matchButton";

@inject('playerStore') @inject('userStore') @observer
class LadderPage extends React.Component {

    componentDidMount() {
        PlayerService.getPlayers().then((response) => {
            //this.props.playerStore.players = response;

            this.props.playerStore.setPlayers(response);
        })
    }

    render() {
        return (
            <div className="ladderContent" style={{height: "100%"}}>
                <Col style={{height: "100%"}} span={5}>
                    <PlayerList playerStore={this.props.playerStore} players={this.props.playerStore.players}/>
                </Col>
                <Col style={{height: "100%"}} span={14}>
                    <PlayerPane player={this.props.playerStore.userPlayer}/>
                    {!_.isEmpty(this.props.playerStore.selectedPlayer) ? <MatchButton/> : ""}
                    <PlayerPane player={this.props.playerStore.selectedPlayer}/>
                </Col>
            </div>
        )
    }
}

export default LadderPage;