import * as React from 'react';
import { Col } from 'antd';
import { inject, observer } from 'mobx-react';
import '../../ladderPage/ladderPage.css';
import PlayerPane from '../../../components/playersPane/playerPane';
import PlayerList from '../../../components/playerList/playerList';

import PlayerService from '../../../services/PlayerService';

@inject('playerStore') @inject('matchStore') @inject('userStore') @observer
class PublicLadderPage extends React.Component {
  componentDidMount() {
    this.props.playerStore.selectPlayer(null);
    PlayerService.getPlayers()
      .then((response) => {
        this.props.playerStore.setPlayers(response);
      });
  }

  render() {
    return (
      <div className="ladderContent" style={{ height: '100%' }}>
        <Col style={{ height: '100%' }} span={5}>
          <PlayerList players={this.props.playerStore.players} public/>
        </Col>
        <Col className="playerPanes" style={{ height: '100%' }} span={14}>
          <PlayerPane player={this.props.playerStore.selectedPlayer} other isPublic/>
        </Col>
      </div>
    );
  }
} export default PublicLadderPage;
