import * as React from "react";
import {inject, observer} from "mobx-react";
import PlayerService from "../../services/PlayerService";
import {Col} from "antd";

import UserInfo from "./userInfo"

import './profilePage.css';

@inject('playerStore') @inject('matchStore') @inject('userStore') @observer
class ProfilePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            player: {},
            isLoading: true

        }
    }

    componentDidMount() {
        //this.setState({username: this.props.match.params.username});
        this.setState({isLoading: true})
        PlayerService.getPlayerByUsername(this.props.match.params.username).then(player => {
            this.setState({player: player})
            this.setState({isLoading: false})

        }).catch(err => {
            this.setState({player: {}})
            this.setState({isLoading: false})
        })
    }

    render() {
            return (
                <div className="profileContent" style={{height: "100%"}}>
                    <Col style={{height: "100%"}} span={6}>
                    </Col>
                    <Col style={{height: "100%"}} span={12}>
                        <UserInfo player={this.state.player} isLoading={this.state.isLoading}/>
                    </Col>
                    <Col style={{height: "100%"}} span={6}>
                    </Col>
                </div>
            )
        }

} export default ProfilePage;