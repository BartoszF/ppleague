import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIndicator from "../../components/common/LoadingIndicator";
import MatchService from "../../services/MatchService";

import "../../pages/profile/userInfo.css"

class MatchHistory extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            player: this.props.player,
            isLoading: this.props.isLoading,
            hasMore: true,
            matches: [],
            initial: true
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.player !== prevProps.player) {
            this.setState({player: this.props.player, matches: [], hasMore: true, initial: true});
            this.loadItems(0);
        }

        if(this.props.isLoading !== prevProps.isLoading)
            this.setState({isLoading: this.props.isLoading})
    }

    isWin(match) {
        return (match.playerA.id === this.state.player.playerId && match.playerAScore > match.playerBScore) ||
                (match.playerB.id === this.state.player.playerId && match.playerBScore > match.playerAScore)
    }

    loadItems(page) {
        this.setState({initial: false})
        MatchService.pagedMatchHistory(this.state.player.playerId,0).then((response) => {
            let matches = response.matches;
            let hasMore = response.hasMore;

            let stateMatches = this.state.matches;

            matches.forEach(match => {stateMatches.push(match)});

            this.setState({hasMore: hasMore, matches: stateMatches});

        }).catch(err => {
        })
    }

    render() {
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

            <div style={{maxHeight: "300px", overflow: "auto"}}>
                <InfiniteScroll
                    pageStart={-1}
                    loadMore={this.loadItems.bind(this)}
                    hasMore={this.state.hasMore}
                    loader={loader}
                    initialLoad={this.state.initial}
                    useWindow={false}>

                    <div className="matches">
                        {items}
                    </div>
                </InfiniteScroll>
            </div>

        );

    }

} export default MatchHistory;