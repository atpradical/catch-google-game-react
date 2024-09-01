import { Game } from '../game.js'
import { EventEmitter } from '../eventEmitter.js'
import { GameComponentView } from '../view.js'
import { Controller } from '../controller.js'

const startGame = async () => {
  // const eventEmitter = new EventEmitter()
  // const game = new Game(eventEmitter)

  // await game.gameStart()

  const controller = new Controller(game)
  // const view = new GameComponentView(controller, game)
  // view.render()
}
