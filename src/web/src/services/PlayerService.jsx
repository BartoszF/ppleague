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

}

export default PlayerService;