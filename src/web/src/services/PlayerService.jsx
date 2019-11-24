import {request} from '../APIUtils';

const PlayerService = {
    getPlayers: function() {
        return request({
            url: "/players",
            method: 'GET'
        });
    },

    getMatches: function (playerId) {
        return request({
            url: "/players/" + playerId + "/matches",
            method: 'GET'
        });
    },

    getPlayerByUsername: function (username) {
        return request({
            url: "/players/byUsername?username="+username,
            method: 'GET'
        });
    },

}

export default PlayerService;