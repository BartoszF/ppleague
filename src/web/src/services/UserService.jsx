import {ACCESS_TOKEN} from "../constants";
import { request } from '../APIUtils';

const UserService = {
    login: function (loginRequest) {
        return request({
            url: "/auth/signin",
            method: 'POST',
            body: JSON.stringify(loginRequest)
        });
    },

    signup: function (signupRequest) {
        return request({
            url: "/auth/signup",
            method: 'POST',
            body: JSON.stringify(signupRequest)
        });
    },

    checkUsernameAvailability: function (username) {
        return request({
            url: "/user/checkUsernameAvailability?username=" + username,
            method: 'GET'
        });
    },

    checkEmailAvailability: function (email) {
        return request({
            url: "/user/checkEmailAvailability?email=" + email,
            method: 'GET'
        });
    },

    getCurrentUser: function () {
        if (!localStorage.getItem(ACCESS_TOKEN)) {
            return Promise.reject("No access token set.");
        }

        return request({
            url: "/user/me",
            method: 'GET'
        });
    },

    getUserProfile: function (username) {
        return request({
            url: "/users/" + username,
            method: 'GET'
        });
    },

    getNotifications: function() {
        return request({
            url: "/user/notifications",
            method: 'GET'
        })
    }
}

export default UserService;