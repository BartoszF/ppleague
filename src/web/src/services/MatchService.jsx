import { request } from '../APIUtils';

const MatchService = {
    getMatchByPlayer: function(player) {
        return request({
            url: "/match/byPlayer?playerId="+player.playerId,
            method: 'GET'
        });
    },

    createInvitation: function(match) {
        return request({
            url: "/match",
            method: 'POST',
            body: JSON.stringify(match)
        })
    },

    acceptInvitation: function(notificationId) {
        return request({
            url: "/match/accept/"+notificationId,
            method: 'GET'
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
    },

    cancelMatch: function(matchId) {
        let body = {
            matchId: matchId
        }
        return request({
            url: "/match/cancel",
            method: 'POST',
            body: JSON.stringify(body)
        })
    },

    acceptMatchCancel: function(matchId) {
        return request({
            url: "/match/"+matchId+"/cancel",
            method: 'GET'
        })
    }

}

export default MatchService;