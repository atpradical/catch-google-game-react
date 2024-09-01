import { PLAYERS, STATUS, STEP_SIZE } from './utils/constants.js'
import { msToMMSS } from './utils/msToMMSS.ts'

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

  #renderGameResultElement() {
    const divResultsElement = document.createElement('div')
    divResultsElement.setAttribute('id', 'game-results')
    divResultsElement.setAttribute('class', 'game-results flex-wrapper')

    for (let i = 1; i <= this.#game.settings.playersAmount; i++) {
      const divElement = document.createElement('div')
      divElement.setAttribute('class', `player${i} scoreboard`)
      const spanElement = document.createElement('span')
      spanElement.append(`Player ${i}: `)
      const scoreValueElement = document.createElement('span')
      scoreValueElement.append(`${this.#game.score[`player${i}`].points}`)
      scoreValueElement.setAttribute('class', `scorevalue`)
      spanElement.append(scoreValueElement)
      divElement.append(spanElement)
      divResultsElement.append(divElement)
    }

    const timeElement = document.createElement('div')
    timeElement.setAttribute('class', `scoreboard`)
    const timerValueElement = document.createElement('span')
    const time = msToMMSS(this.#game.settings.gameTime)

    if (this.#game.settings.gameTime / 1000 <= 10) {
      timerValueElement.setAttribute('class', `timer red`)
    } else {
      timerValueElement.setAttribute('class', `timer`)
    }
    timeElement.textContent = `Time: `
    timerValueElement.textContent = `${time}`
    timeElement.append(timerValueElement)
    divResultsElement.append(timeElement)

    this.#gameResultsElement.append(divResultsElement)
  }

  #renderGame() {
    const status = this.#game.gameStatus
    const settings = this.#game.settings
    const players = this.#game.players
    const google = this.#game.google
    const winner = this.#game.winner
    const score = this.#game.score
    switch (status) {
      case STATUS.IN_PROGRESS:
        this.#bindEventListeners()
        this.#gameStatisticElement = ''
        for (let y = 1; y <= settings.gridSize.y; y++) {
          const trElement = document.createElement('tr')

          for (let x = 1; x <= settings.gridSize.x; x++) {
            const tdElement = document.createElement('td')

            for (let i = 1; i <= settings.playersAmount; i++) {
              if (
                players[`player${i}`].position.x === x &&
                players[`player${i}`].position.y === y
              ) {
                const imgElement = document.createElement('img')
                const tdTitle = document.createElement('span')
                tdTitle.setAttribute('class', `td-title`)
                tdTitle.textContent = `Player ${i}`
                imgElement.src = `./assets/player-${i}.png`
                tdElement.appendChild(tdTitle)
                tdElement.appendChild(imgElement)
              }
            }

            if (google.position.x === x && google.position.y === y) {
              const imgElement = document.createElement('img')
              imgElement.src = './assets/Google.png'
              tdElement.appendChild(imgElement)
            }
            trElement.appendChild(tdElement)
          }
          this.#tableElement.appendChild(trElement)
        }
        break

      case STATUS.FINISHED:
        this.#unbindEventListeners()
        const statisticElement = document.querySelector('#game-statistics')
        statisticElement.removeAttribute('class', `hidden`)

        const divNotificationElement = document.createElement('div')
        divNotificationElement.setAttribute('class', `notification flex-wrapper`)

        const notificationTitle = document.createElement('h5')
        notificationTitle.setAttribute('class', `notification-title`)
        notificationTitle.innerHTML = `Game Results:`
        divNotificationElement.appendChild(notificationTitle)

        const scoreElement = document.createElement('div')

        for (const scoreKey in score) {
          const scoreItem = document.createElement('div')
          scoreItem.setAttribute('class', `notification-message`)

          const imgElement = document.createElement('img')
          imgElement.setAttribute('class', `notification-img`)
          const spanElement = document.createElement('span')
          divNotificationElement.appendChild(imgElement)

          if (scoreKey === winner) {
            imgElement.src = './assets/win-icon.png'
          } else {
            imgElement.src = './assets/lose-icon.png'
          }
          scoreItem.appendChild(imgElement)
          spanElement.innerText = `${scoreKey}: ${score[scoreKey].points} points`
          scoreItem.appendChild(spanElement)
          scoreElement.appendChild(scoreItem)
        }

        divNotificationElement.appendChild(scoreElement)

        const button = document.querySelector('#game-button')
        button.innerText = 'Play again'
        button.removeAttribute('class', `hidden`)
        button.setAttribute('class', `btn`)
        divNotificationElement.appendChild(button)

        statisticElement.appendChild(divNotificationElement)
        break
    }
  }

  render() {
    this.#tableElement.innerHTML = ''
    this.#gameResultsElement.innerHTML = ''
    this.#renderGame()
    this.#renderGameResultElement()
  }
}
