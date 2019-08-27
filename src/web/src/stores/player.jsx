import {observable} from "mobx"

export default class Player {
    @observable id = 0
    @observable name = ""
    @observable rating = 1000
    @observable deviation = 0
    @observable dupa = 0

    constructor(id, name, rating, deviation, dupa) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.deviation = deviation;
        this.dupa = dupa;
    }

}