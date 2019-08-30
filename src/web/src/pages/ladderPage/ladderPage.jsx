import * as React from "react";
import {inject, observer} from "mobx-react";
import PlayerList from "../../components/playerList/playerList";
import PlayerService from "../../services/PlayerService";
import {Col, Row} from "antd";

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
            <div style={{height: "100%"}}>
                <Col span={5}/>
                <Col className="ladderContent" span={14}>
                    <Col style={{height: "100%"}} span={8}>
                        <PlayerList playerStore={this.props.playerStore} players={this.props.playerStore.players}/>
                    </Col>
                    <Col style={{height: "100%"}} span={16}>
                        <PlayerPane player={this.props.playerStore.userPlayer}/>
                        {!_.isEmpty(this.props.playerStore.selectedPlayer) ? <MatchButton /> : ""}
                        <PlayerPane player={this.props.playerStore.selectedPlayer}/>
                    </Col>
                </Col>
                <Col span={5}/>
            </div>
        )
    }
}

export default LadderPage;