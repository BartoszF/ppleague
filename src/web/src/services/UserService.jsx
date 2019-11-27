import { ACCESS_TOKEN } from '../constants';
import { request } from '../APIUtils';

const UserService = {
    login(loginRequest) {
        return request({
            url: '/auth/signin',
            method: 'POST',
            body: JSON.stringify(loginRequest),
        });
    },

    signup(signupRequest) {
        return request({
            url: '/auth/signup',
            method: 'POST',
            body: JSON.stringify(signupRequest),
        });
    },

    checkUsernameAvailability(username) {
        return request({
            url: `/user/checkUsernameAvailability?username=${username}`,
            method: 'GET',
        });
    },

    checkEmailAvailability(email) {
        return request({
            url: `/user/checkEmailAvailability?email=${email}`,
            method: 'GET',
        });
    },

    getCurrentUser() {
        if (!localStorage.getItem(ACCESS_TOKEN)) {
            return Promise.reject('No access token set.');
        }

        return request({
            url: '/user/me',
            method: 'GET',
        });
    },

    getUserProfile(username) {
        return request({
            url: `/users/${username}`,
            method: 'GET',
        });
    },

    getNotifications() {
        return request({
            url: '/user/notifications',
            method: 'GET',
        });
    },
};

export default UserService;
