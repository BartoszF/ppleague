import * as React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Col } from 'antd';
import PlayerList from '../../components/playerList/playerList';
import PlayerService from '../../services/PlayerService';

import './ladderPage.css';
import PlayerPane from '../../components/playersPane/playerPane';
import MatchService from '../../services/MatchService';
import OwnMatchHistory from '../../components/matchHistory/ownMatchHistory';

@inject('playerStore') @inject('matchStore') @inject('userStore') @observer
class LadderPage extends React.Component {
  componentDidMount() {
    const { playerStore, userStore } = this.props;

    playerStore.selectPlayer(null);
    PlayerService.getPlayers()
      .then((response) => {
        playerStore.setPlayers(response);
      });
  }

  render() {
    const { playerStore } = this.props;
    const { players, userPlayer, selectedPlayer } = playerStore;

    return (
      <div className="ladderContent" style={{ height: '100%' }}>
        <Col style={{ height: '100%' }} span={5}>
          <PlayerList players={players} />
        </Col>
        <Col className="playerPanes" style={{ height: '100%' }} span={14}>
          <PlayerPane player={userPlayer} />
          <PlayerPane player={selectedPlayer} other={true} />
        </Col>
        <Col className="historyContent" style={{ height: '100%' }} span={5}>
          <div className="historyHeader"><span>Your last matches against:</span></div>
          <OwnMatchHistory />
        </Col>
      </div>
    );
  }
}

export default LadderPage;
