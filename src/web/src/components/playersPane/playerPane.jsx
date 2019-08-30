import * as React from "react";
import "./playerPane.css";
import _ from "lodash";
import { Avatar } from "antd";

class PlayerPane extends React.Component {
  render() {
    if (_.isEmpty(this.props.player)) {
      return <div className={"playerPane"}></div>;
    }
    return (
      <div className={"playerPane"}>
        <div className={"playerImage"}>
          <Avatar size={82} icon="user" />
        </div>
        <div className={"playerName"}>
          #{this.props.player.standing} {this.props.player.name}
        </div>
        <div className={"playerRating"}>
          <h2>Rating</h2>
          <h2>{this.props.player.rating}</h2>
        </div>
      </div>
    );
  }
}

export default PlayerPane;
