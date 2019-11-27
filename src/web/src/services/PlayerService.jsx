import { request } from '../APIUtils';

const PlayerService = {
    getPlayers() {
        return request({
            url: '/players',
            method: 'GET',
        });
    },

    getMatches(playerId) {
        return request({
            url: `/players/${playerId}/matches`,
            method: 'GET',
        });
    },

    getPlayerByUsername(username) {
        return request({
            url: `/players/byUsername?username=${username}`,
            method: 'GET',
        });
    },

};

export default PlayerService;
