import {STATUS, UNITS} from "./utils/constants.js";

/**
 * Game model (Business Logic Layer)
 */
export class Game {
    #settings = {
        playersAmount: 1,
        pointsToWin: 5,
        gameTime: 5000,
        gridSize: {x: 3, y: 3},
        googleJumpInterval: 2000,
        gameMode: 'single'
    }
    #gameStatus = STATUS.PENDING
    #gameTimeTimerId
    #players = {
        // player1: {id: 1, position: {x, y}, winner: 'false'}
        // player2: {id: 2, position: {x, y}, winner: 'true'}
    }
    #google
    #googleJumpIntervalId
    #score = {
        // player1: {points: 0},
        // player2: {points: 0},
    }
    #winner
    #occupiedPositions = {
        player: [],
        google: []
    }


    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter //dependency injection
    }


    // --------- game settings & statistics ---------
    get settings() {
        return this.#settings
    }

    set settings(settings) {
        this.#settings = {...this.settings, ...settings};
    }

    get score() {
        return this.#score
    }

    #increaseScore(player) {
        this.#score[player].points += 1
    }

    get winner() {
        return this.#winner
    }


    // --------- game state ---------
    get gameStatus() {
        return this.#gameStatus
    }

    async gameStart() {
        if (this.gameStatus === STATUS.PENDING || this.gameStatus === STATUS.FINISHED) {
            this.#createGameUnits()
            this.#gameStatus = STATUS.IN_PROGRESS
            this.#runGameTimer()
            this.#runGoogleJumpInterval()
        }
    }

    async gameStop() {
        clearInterval(this.#googleJumpIntervalId)
        clearInterval(this.#gameTimeTimerId)
        this.#gameStatus = STATUS.STOPPED
    }

    async gameFinish() {
        this.#gameStatus = STATUS.FINISHED
        clearInterval(this.#googleJumpIntervalId)
        clearInterval(this.#gameTimeTimerId)
        this.#google.position = new Position(-1, -1)
        this.#findWinner()
    }

    #runGameTimer() {
        this.#gameTimeTimerId = setInterval(() => {
            this.settings.gameTime -= 1000

            if (this.settings.gameTime === 0) {
                this.gameFinish()
            }
            this.eventEmitter.emit('change')
        }, 1000)
    }

    #setGameWinner(player) {
        this.#winner = player
    }

    #findWinner() {
        let winner = ''
        let maxPoints = 0;

        for (const player in this.#score) {
            if (this.#score[player].points > maxPoints) {
                maxPoints = this.#score[player].points;
                winner = player;
            }
        }

        if (maxPoints === this.settings.pointsToWin) {
            this.#setGameWinner(winner)
        }
    }


    // --------- game units: players & google ---------
    get players() {
        return this.#players
    }

    get google() {
        return this.#google
    }

    // #leagacy_createGameUnits() {
    //     const player1Position = this.#getRandomPosition()
    //     this.#player1 = new Player(player1Position, 1)
    //
    //     const player2Position = this.#getRandomPosition([player1Position])
    //     this.#player2 = new Player(player2Position, 2)
    //
    //     const googlePosition = this.#getRandomPosition([player1Position, player2Position])
    //     this.#google = new Google(googlePosition, 'Google')
    // }
    #createGameUnits() {
        for (let i = 1; i <= this.settings.playersAmount; i++) {
            const playerPosition = this.#getRandomPosition(UNITS.PLAYER)
            this.players[`player${i}`] = new Player(playerPosition, i)
            this.#score[`player${i}`] = {points: 0}
        }
        const googlePosition = this.#getRandomPosition(UNITS.GOOGLE)
        this.#google = new Google(googlePosition, 'Google')
        this.#occupiedPositions.google.push(googlePosition)
    }

    // movePlayer(player, secondPlayer, stepSize) {
    //     const isBorder = this.#checkBorders(player, stepSize)
    //     if (isBorder) return
    //
    //     const isOtherPlayer = this.#checkOtherPlayer(player, secondPlayer, stepSize)
    //     if (isOtherPlayer) return
    //
    //     if (stepSize.x) {
    //         player.position = new Position(player.position.x + stepSize.x, player.position.y)
    //     } else if (stepSize.y) {
    //         player.position = new Position(player.position.x, player.position.y + stepSize.y)
    //     }
    //
    //     this.#checkGoogleCatching(player)
    //
    //     if (this.settings.gameMode) {
    //         return
    //     }
    //
    //     // Уведомляем наблюдателя, что пора вызвать подписанное событие: render() во view.
    //     this.eventEmitter.emit('change')
    // }
    movePlayer(player, stepSize) {
        const playerPrevPosition = this.players[player].position.clone()

        const isBorder = this.#checkBorders(player, stepSize)
        if (isBorder) return

        const checkOtherPlayer = this.#checkOtherPlayer(player, stepSize)
        if (checkOtherPlayer) return

        if (stepSize.x) {
            this.players[player].position = new Position(
                this.players[player].position.x + stepSize.x,
                this.players[player].position.y
            )
        } else if (stepSize.y) {
            this.players[player].position = new Position(
                this.players[player].position.x,
                this.players[player].position.y + stepSize.y
            )
        }
        this.#occupiedPositions[UNITS.PLAYER].push(new Position(
            this.players[player].position.x,
            this.players[player].position.y
        ))
        this.#deleteFromOccupiedPositions(playerPrevPosition, UNITS.PLAYER)
        this.#checkGoogleCatching(player)

        if (this.settings.gameMode === 'test') {
            return
        }

        // Уведомляем наблюдателя, что пора вызвать подписанное событие: render() во view.
        this.eventEmitter.emit('change')
    }

    // #legacy_moveGoogleToRandomPosition() {
    //     const googlePosition = this.#getRandomPosition([
    //         this.#player1.position,
    //         this.#player2.position,
    //         this.#google.position
    //     ])
    //     this.#google = new Google(googlePosition)
    //
    //     if (this.settings.gameMode) {
    //         return
    //     }
    //
    //     this.eventEmitter.emit('change')
    // }
    #moveGoogleToRandomPosition() {
        const currentPosition = this.#google.position.clone()
        const googlePosition = this.#getRandomPosition(UNITS.GOOGLE)
        this.#google = new Google(googlePosition)
        this.#deleteFromOccupiedPositions(currentPosition, UNITS.GOOGLE)

        if (this.settings.gameMode === 'test') {
            return
        }
        this.eventEmitter.emit('change')
    }

    #runGoogleJumpInterval() {
        this.#googleJumpIntervalId = setInterval(() => {
            this.#moveGoogleToRandomPosition()
        }, this.#settings.googleJumpInterval)
    }


    // --------- game units: utils functions ---------

    // #legacy_checkOtherPlayer(movingPlayer, secondPlayer, stepSize) {
    //     const newPosition = movingPlayer.position.clone()
    //     newPosition.x += stepSize.x
    //     newPosition.y += stepSize.y
    //     return newPosition.x === secondPlayer.position.x && newPosition.y === secondPlayer.position.y;
    // }
    #checkOtherPlayer(player, stepSize) {
        const newPosition = this.players[player].position.clone()
        newPosition.x += stepSize.x
        newPosition.y += stepSize.y
        return this.occupiedPositions[UNITS.PLAYER].some((position) => newPosition.x === position.x &&
            newPosition.y === position.y)
    }

    #checkBorders(player, stepSize) {
        const newPosition = this.players[player].position.clone()
        newPosition.x += stepSize.x
        newPosition.y += stepSize.y
        return (1 > newPosition.x || newPosition.x > this.#settings.gridSize.x)
            || (1 > newPosition.y || newPosition.y > this.#settings.gridSize.y)
    }

    #checkGoogleCatching(player) {
        if (this.players[player].position.x === this.#google.position.x &&
            this.players[player].position.y === this.#google.position.y) {
            this.#increaseScore(player)

            if (this.score[player].points === this.settings.pointsToWin) {
                this.gameFinish()
                return
            }

            clearInterval(this.#googleJumpIntervalId)
            this.#moveGoogleToRandomPosition()
            this.#runGoogleJumpInterval()
        }
    }

    // #legacy_getRandomPosition(restrictedPositions = []) {
    //     let newX
    //     let newY
    //     do {
    //         newX = NumberUtil.getRandomNumber(1, this.#settings.gridSize.x)
    //         newY = NumberUtil.getRandomNumber(1, this.#settings.gridSize.y)
    //     } while (
    //         restrictedPositions.some((position) => newX === position.x && newY === position.y)
    //         )
    //     return new Position(newX, newY)
    // }
    #getRandomPosition(unit) {
        let newX
        let newY

        if (unit === UNITS.PLAYER) {
            do {
                newX = NumberUtil.getRandomNumber(1, this.#settings.gridSize.x)
                newY = NumberUtil.getRandomNumber(1, this.#settings.gridSize.y)
            } while (
                this.occupiedPositions[unit].some((position) => newX === position.x && newY === position.y)
                )
        } else if (unit === UNITS.GOOGLE) {
            do {
                newX = NumberUtil.getRandomNumber(1, this.#settings.gridSize.x)
                newY = NumberUtil.getRandomNumber(1, this.#settings.gridSize.y)
            } while (
                this.#occupiedPositions[unit].some((position) => newX === position.x && newY === position.y) ||
                this.#occupiedPositions[UNITS.PLAYER].some((position) => newX === position.x && newY === position.y)
                )
        }

        this.#occupiedPositions[unit].push(new Position(newX, newY))
        return new Position(newX, newY)
    }

    get occupiedPositions() {
        return this.#occupiedPositions
    }

    #deleteFromOccupiedPositions(position, unit) {
        this.#occupiedPositions[unit] = this.#occupiedPositions[unit]
            .filter(p => JSON.stringify(p) !== JSON.stringify(position));
    }


}


class NumberUtil {
    /**
     * @param {number} min - Lower limit value of the range (inclusive).
     * @param {number} max - The upper limit value of the range (inclusive).
     * @returns {number} - A random number between min and max, including both values.
     */
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Position(this.x, this.y)
    }

    equal(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
    }
}

class Unit {
    #position

    constructor(position, id) {
        this.position = position;
        this.id = id
    }

    get position() {
        return new Position(this.#position.x, this.#position.y);
    }

    set position(position) {
        this.#position = position
    }
}

class Player extends Unit {
    constructor(position, id) {
        super(position, id);
    }
}

class Google extends Unit {
    constructor(position, id) {
        super(position, id);
    }
}