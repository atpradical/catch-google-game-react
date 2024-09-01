export class Controller {
  #model

  constructor(gameModel) {
    this.#model = gameModel
  }

  async startGame() {
    await this.#model.gameStart()
  }

  getGameStatus() {
    return this.#model.gameStatus
  }

  getGameSettings() {
    return this.#model.settings
  }

  setGameSettings(newSettings) {
    this.#model.settings = newSettings
  }

  getPlayerData(player) {
    return this.#model.players[player]
  }

  getGoogleData() {
    return this.#model.google
  }

  getGameScore() {
    return this.#model.score
  }

  movePlayer(player, stepSize) {
    this.#model.movePlayer(player, stepSize)
  }
  getGameWinner() {
    return this.#model.winner
  }
}
