import * as React from 'react';
import { inject, observer } from 'mobx-react';

import _ from 'lodash';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import MatchHistory from '../../components/userInfo/matchHistory';


import './userInfo.css';

@inject('playerStore') @inject('matchStore') @inject('userStore') @observer
class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: this.props.player,
      isLoading: this.props.isLoading,
      hasMore: true,
      matches: [],
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props.player !== prevProps.player) this.setState({ player: this.props.player });

    if (this.props.isLoading !== prevProps.isLoading) this.setState({ isLoading: this.props.isLoading });
  }

  noPlayer() {
    return ('No player with this username');
  }

  fullInfo() {
    return (
      <div className="userInfo">
        <h1 className="userName">{this.state.player.name}</h1>
        <MatchHistory player={this.props.player} isLoading={false}/>
      </div>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator/>;
    }

    return (
      <div className="userInfo">
        {!_.has(this.state, 'player') || _.isEmpty(this.state.player) ? this.noPlayer() : this.fullInfo()}

      </div>
    );
  }
} export default UserInfo;
