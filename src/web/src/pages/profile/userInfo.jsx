import * as React from "react";
import {inject, observer} from "mobx-react";
import PlayerService from "../../services/PlayerService";
import MatchService from "../../services/MatchService";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import InfiniteScroll from 'react-infinite-scroller';

import _ from 'lodash';

import './userInfo.css';

@inject('playerStore') @inject('matchStore') @inject('userStore') @observer
class UserInfo extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            player: this.props.player,
            isLoading: this.props.isLoading,
            hasMore: true,
            matches: []
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        if(this.props.player != prevProps.player)
            this.setState({player: this.props.player});

        if(this.props.isLoading != prevProps.isLoading)
            this.setState({isLoading: this.props.isLoading})
    }

    noPlayer() {
        return ("No player with this username")
    }

    loadItems(page) {
        MatchService.pagedMatchHistory(this.state.player.playerId,page).then((response) => {
            let matches = response.matches;
            let hasMore = response.hasMore;

            let stateMatches = this.state.matches;

            matches.forEach(match => {stateMatches.push(match)});

            this.setState({hasMore: hasMore, matches: stateMatches});

        }).catch(err => {
        })
    }

    isWin(match) {
        return (match.playerA.id === this.state.player.playerId && match.playerAScore > match.playerBScore) ||
                (match.playerB.id === this.state.player.playerId && match.playerBScore > match.playerAScore)
    }

    fullInfo() {
        const loader = <LoadingIndicator/>;

        var items = [];
        this.state.matches.map((match, i) => {
            items.push(
                <div className={"match " + (this.isWin(match) ? "win" : "lose")} key={i}>
                    <span>{match.playerA.user.username}</span>
                    <span>
                        {match.playerAScore + " : " + match.playerBScore}
                    </span>

                    <span>{match.playerB.user.username}</span>
                </div>
            );
        });
        return (
        <div className="userInfo">
            <h1 className="userName">{this.state.player.name}</h1>
            <InfiniteScroll
                pageStart={-1}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMore}
                loader={loader}>

                <div className="matches">
                    {items}
                </div>
            </InfiniteScroll>
        </div>
        );
    }

    render() {

        if(this.state.isLoading) {
            return <LoadingIndicator/>;
        }

        return (<div className="userInfo">
            {!_.has(this.state, "player") || _.isEmpty(this.state.player) ? this.noPlayer() : this.fullInfo()}

        </div>);
    }

} export default UserInfo;