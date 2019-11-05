import {ACCESS_TOKEN} from './constants';

export function request(options) {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    //TODO: Dev?
    const API_URL = "https://ppleague-backend.herokuapp.com/";

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(API_URL + options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};