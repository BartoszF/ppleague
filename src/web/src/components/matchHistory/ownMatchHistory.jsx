import * as React from 'react';
import { inject, observer } from 'mobx-react';
import './matchHistory.css';
import MatchService from '../../services/MatchService';
import LoadingIndicator from '../common/LoadingIndicator';

@inject('matchStore') @inject('playerStore') @inject('userStore') @observer
class OwnMatchHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      matches: [],
    };
  }

  componentDidMount() {
    const { userStore } = this.props;
    MatchService.getMatchByPlayer(userStore.player).then((resp) => {
      this.setState({ matches: resp.matches, isLoading: false });
    });
  }

  showMatches() {
    const { userStore } = this.props;
    let { matches } = this.state;
    matches = matches.reverse().slice(0, 20);
    const rows = matches.map((item, key) => {
      const match = item;
      let myScore = 0;
      let otherScore = 0;
      let otherName = '';
      if (match.playerA.id === userStore.player.playerId) {
        myScore = match.playerAScore;
        otherScore = match.playerBScore;
        otherName = match.playerB.user.username;
      } else {
        myScore = match.playerBScore;
        otherScore = match.playerAScore;
        otherName = match.playerA.user.username;
      }

      return (
        <div key={item.id} className="matchRow">
          <span className="myScore">{myScore}</span>
        :
          <span className="otherScore">{otherScore}</span>
          <span className="otherName">{otherName}</span>
        </div>
      );
    });

    return rows;
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (<LoadingIndicator />);
    }
    return (
      <div>{this.showMatches()}</div>
    );
  }
}

export default OwnMatchHistory;
