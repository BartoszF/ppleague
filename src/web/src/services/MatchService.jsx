import { request } from '../APIUtils';

const MatchService = {
    getMatchByPlayer(player) {
        return request({
            url: `/match/byPlayer?playerId=${player.playerId}`,
            method: 'GET',
        });
    },

    createInvitation(match) {
        return request({
            url: '/match',
            method: 'POST',
            body: JSON.stringify(match),
        });
    },

    acceptInvitation(notificationId) {
        return request({
            url: `/match/accept/${notificationId}`,
            method: 'GET',
        });
    },

    getOngoinMatch() {
        return request({
            url: '/match/ongoing',
            method: 'GET',
        });
    },

    endMatch(playerAScore, playerBScore, matchId) {
        const body = {
            matchId,
            playerAScore,
            playerBScore,
        };
        return request({
            url: '/match/end',
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    cancelMatch(matchId) {
        const body = {
            matchId,
        };
        return request({
            url: '/match/cancel',
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    acceptMatchCancel(matchId) {
        return request({
            url: `/match/${matchId}/cancel`,
            method: 'GET',
        });
    },

    pagedMatchHistory(playerId, page) {
        return request({
            url: `/match/pagedByPlayer?playerId=${playerId}&page=${page}`,
            method: 'GET',
        });
    },

};

export default MatchService;
