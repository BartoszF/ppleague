import React from 'react';
import { InputNumber, Modal } from 'antd';
import { inject, observer } from 'mobx-react';

import './matchScoreModal.css';
import MatchService from '../../services/MatchService';

@inject('matchStore')
@observer
class MatchScoreModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };

    this.ongoingMatch = this.props.matchStore.ongoingMatch;
    this.playerAScoreChange = this.playerAScoreChange.bind(this);
    this.playerBScoreChange = this.playerBScoreChange.bind(this);
  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.visible !== props.visible) {
      return {
        visible: props.visible,
      };
    }
    return null;
  }

  handleOk = (e) => {
    console.log(e);
    console.log(`${this.state.playerAScore} ${this.state.playerBScore}`);

    MatchService.endMatch(
      this.state.playerAScore,
      this.state.playerBScore,
      this.ongoingMatch.id,
    )
      .then((response) => {
        this.setState({
          visible: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  playerAScoreChange(score) {
    this.setState({ playerAScore: score });
  }

  playerBScoreChange(score) {
    this.setState({ playerBScore: score });
  }

  render() {
    if (!this.ongoingMatch.playerA) {
      return '';
    }
    return (
      <div>
        <Modal
          title="Enter score"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
        >
          <div className="players">
            <div className="player playerA">
              <h2>{this.ongoingMatch.playerA.user.name}</h2>
              <div>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  size="large"
                  onChange={this.playerAScoreChange}
                />
              </div>
            </div>

            <div className="player playerB">
              <h2>{this.ongoingMatch.playerB.user.name}</h2>
              <InputNumber
                defaultValue={0}
                min={0}
                size="large"
                onChange={this.playerBScoreChange}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default MatchScoreModal;
