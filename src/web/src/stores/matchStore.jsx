import {observable, action, computed} from "mobx";

import MatchService from "../services/MatchService";

import _ from 'lodash';

class MatchStore {
    @observable selectedPlayerMatches = [];
    @observable userPlayerMatches = [];
    @observable selectedPlayerLoading = false;
    @observable ongoingMatch = null

    @action setSelectedPlayerMatches(matches) {
        this.selectedPlayerMatches = matches;
        this.selectedPlayerLoading = false;
    }

    @action setUserPlayerMatches(matches) {
        this.userPlayerMatches = matches;
    }

    @action setOngoingMatch(response) {
        this.ongoingMatch = response;
    }

    @action
    getOngoingMatch() {
        MatchService.getOngoinMatch().then(

            action('getOngoingMatch', match => {
                this.setOngoingMatch(match);
            }),
            action('error', err => {
                console.log(err);
            })
         );
    }
}

export default new MatchStore();