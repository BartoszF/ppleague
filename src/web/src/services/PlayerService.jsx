import { request } from '../APIUtils';

const PlayerService = {
    getPlayers: function() {
        return request({
            url: "/players",
            method: 'GET'
        });
    }

}

export default PlayerService;