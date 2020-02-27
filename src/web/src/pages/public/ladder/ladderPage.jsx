import React, { useEffect } from 'react';
import { Col } from 'antd';
import { observer } from 'mobx-react';
import '../../ladderPage/ladderPage.css';
import PlayerPane from '../../../components/playersPane/playerPane';
import PlayerList from '../../../components/playerList/playerList';

import PlayerService from '../../../services/PlayerService';
import useStores from '../../../useStores';

export const PublicLadderPage = observer((props) => {
  const { playerStore } = useStores();
  const { players, selectedPlayer } = playerStore;

  useEffect(() => {
    props.playerStore.selectPlayer(null);
    PlayerService.getPlayers()
      .then((response) => {
        props.playerStore.setPlayers(response);
      });
  }, []);

  return (
    <div className="ladderContent" style={{ height: '100%' }}>
      <Col style={{ height: '100%' }} span={5}>
        <PlayerList players={players} public/>
      </Col>
      <Col className="playerPanes" style={{ height: '100%' }} span={14}>
        <PlayerPane player={selectedPlayer} other isPublic/>
      </Col>
    </div>
  );
});
