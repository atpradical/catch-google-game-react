import { Game } from './game.js'
import { EventEmitter } from './eventEmitter.js'
import { GameComponentView } from './view.js'
import { Controller } from './controller.js'
import { parseGameGridString } from './utils/parseGameGridString.ts'

const startGame = async () => {
  console.log('GAAAAMEEE!!!')
  const eventEmitter = new EventEmitter()
  const game = new Game(eventEmitter)

  game.settings = getUserGameSettings()
  await game.gameStart()

  const controller = new Controller(game)
  const view = new GameComponentView(controller, game)
  view.render()
}

const getUserGameSettings = () => {
  const userSettings = {}

  const gridSizeElement = document.querySelector('#grid-size').value
  userSettings.gridSize = parseGameGridString(gridSizeElement)

  const pointsToWinElement = document.querySelector('#points-to-win').value
  userSettings.pointsToWin = Number(pointsToWinElement)

  const timeLeftElement = document.querySelector('#game-time').value
  userSettings.gameTime = Number(timeLeftElement)

  const gameModeElement = document.querySelector('#game-mode').value
  userSettings.gameMode = gameModeElement

  if (gameModeElement === 'multiplayer') {
    userSettings.playersAmount = 2
  }

  return userSettings
}

const startGameHandler = () => {

    const gameContainer = document.querySelector('#game-container')
    const button = document.querySelector('#game-button')
    button.setAttribute('class', `hidden`)
    gameContainer.appendChild(button)

    // const gameSettingsElement = document.querySelector('#game-settings')
    // gameSettingsElement.setAttribute('class', `hidden`)

    const statisticElement = document.querySelector("#game-statistics")
    statisticElement.innerHTML = ''
    statisticElement.setAttribute('class', `hidden`)

    startGame()
}


const button = document.querySelector('#game-button')
button.innerText = 'Start Game'
button.addEventListener('click', startGameHandler)