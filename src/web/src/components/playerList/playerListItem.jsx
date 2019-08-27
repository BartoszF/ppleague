import * as React from "react";


export default class PlayerListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            player: props.player
        }
    }

    render() {
        return (<div>{this.state.player.name}</div>)
    }
}