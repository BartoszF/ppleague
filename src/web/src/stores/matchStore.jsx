import {observable, action} from "mobx";

class MatchStore {
    @observable selectedPlayerMatches = [];
    @observable userPlayerMatches = [];
    @observable selectedPlayerLoading = false;
    @observable ongoingMatch = {}

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
}

export default new MatchStore();