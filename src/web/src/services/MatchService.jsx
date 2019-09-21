import { request } from '../APIUtils';

const MatchService = {
    getMatchByPlayer: function(player) {
        return request({
            url: "/match/byPlayer?playerId="+player.playerId,
            method: 'GET'
        });
    },

    createMatch: function(match) {
        return request({
            url: "/match",
            method: 'POST',
            body: JSON.stringify(match)
        })
    },

    getOngoinMatch: function() {
        return request({
            url: "/match/ongoing",
            method: 'GET'
        });
    },

    endMatch: function(playerAScore,playerBScore, matchId) {
        let body = {
            matchId: matchId,
            playerAScore: playerAScore,
            playerBScore: playerBScore
        }
        return request({
            url: "/match/end",
            method: 'POST',
            body: JSON.stringify(body)
        })
    }

}

export default MatchService;