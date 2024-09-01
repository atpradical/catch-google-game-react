import { PLAYERS, STATUS, STEP_SIZE } from '../utils/constants.js'
import { msToMMSS } from '../utils/msToMMSS.ts'

export class GameComponentView {
  #gameContainerElement
  #tableElement
  #gameResultsElement
  #gameStatisticElement
  #game
  #controller
  #unbindEventListeners = null

  constructor(controller, game) {
    this.#game = game
    this.#controller = controller
    this.#gameContainerElement = document.querySelector('#game-container')
    this.#tableElement = document.querySelector('#game-grid')
    this.#gameResultsElement = document.querySelector('#game-results-block')

    game.eventEmitter.subscribe('change', () => {
      this.render()
    })
  }

  #bindEventListeners() {
    if (this.#unbindEventListeners !== null) {
      this.#unbindEventListeners()
    }

    const controlsHandler = {
      // "ArrowUp": () => this.#controller.movePlayer(PLAYERS.ONE, DIRECTION.UP),
      // "ArrowDown": () => this.#controller.movePlayer(PLAYERS.ONE, DIRECTION.DOWN),
      // "ArrowLeft": () => this.#controller.movePlayer(PLAYERS.ONE, DIRECTION.LEFT),
      // "ArrowRight": () => this.#controller.movePlayer(PLAYERS.ONE, DIRECTION.RIGHT),
      //
      // "KeyW": () => this.#controller.movePlayer(PLAYERS.TWO, DIRECTION.UP),
      // "KeyS": () => this.#controller.movePlayer(PLAYERS.TWO, DIRECTION.DOWN),
      // "KeyA": () => this.#controller.movePlayer(PLAYERS.TWO, DIRECTION.LEFT),
      // "KeyD": () => this.#controller.movePlayer(PLAYERS.TWO, DIRECTION.RIGHT),

      ArrowUp: () => this.#controller.movePlayer(PLAYERS.ONE, STEP_SIZE.UP),
      ArrowDown: () => this.#controller.movePlayer(PLAYERS.ONE, STEP_SIZE.DOWN),
      ArrowLeft: () => this.#controller.movePlayer(PLAYERS.ONE, STEP_SIZE.LEFT),
      ArrowRight: () => this.#controller.movePlayer(PLAYERS.ONE, STEP_SIZE.RIGHT),

      KeyW: () => this.#controller.movePlayer(PLAYERS.TWO, STEP_SIZE.UP),
      KeyS: () => this.#controller.movePlayer(PLAYERS.TWO, STEP_SIZE.DOWN),
      KeyA: () => this.#controller.movePlayer(PLAYERS.TWO, STEP_SIZE.LEFT),
      KeyD: () => this.#controller.movePlayer(PLAYERS.TWO, STEP_SIZE.RIGHT),
    }
    const bindPlayersControls = e => {
      const handler = controlsHandler[e.code]
      if (handler) {
        handler()
      }
    }
    this.#unbindEventListeners = () => {
      window.removeEventListener('keydown', bindPlayersControls)
    }
    window.addEventListener('keydown', bindPlayersControls)
  }
}
