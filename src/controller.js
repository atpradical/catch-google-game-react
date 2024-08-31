export class Controller {
    #model

    constructor(gameModel) {
        this.#model = gameModel;
    }

    movePlayer(player, stepSize) {
        this.#model.movePlayer(player, stepSize)

    }
}