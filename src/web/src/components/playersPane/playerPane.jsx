import * as React from "react";
import './playerPane.css';

class PlayerPane extends React.Component {
    render() {
        return (<div className={"playerPane"}>{this.props.player.name}</div>)
    }
}

export default PlayerPane