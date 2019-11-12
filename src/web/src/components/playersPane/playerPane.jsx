import * as React from "react";
import "./playerPane.css";
import _ from "lodash";
import {Avatar} from "antd";

import MatchButton from "./matchButton";
import {observer} from "mobx-react";

@observer
class PlayerPane extends React.Component {

    matchButton() {
        if (this.props.other) return (<MatchButton/>);
    }

    getMatches() {
        return (<h3>Matches: W {this.props.player.matches != null ? this.props.player.matches.won : '_'} /
                L {this.props.player.matches != null ? this.props.player.matches.lost : '_'}</h3>
        );
    }

    render() {
        if (_.isEmpty(this.props.player)) {
            return <div className={"playerPane"}></div>;
        }
        return (
            <div className={"playerPane"}>
                <div className={"playerImage"}>
                    <Avatar size={82} icon="user"/>
                </div>
                <div className={"playerName"}>
                    #{this.props.player.standing} {this.props.player.name}
                </div>
                <div className={"playerRating"}>
                    <h2>Rating: {parseFloat(this.props.player.rating).toFixed(2)}</h2>
                    {this.getMatches()}
                </div>

                {this.matchButton()}
            </div>
        );
    }
}

export default PlayerPane;
