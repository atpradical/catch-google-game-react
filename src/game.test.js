import {Game} from "./game.js";
import {STATUS, STEP_SIZE} from "./utils/constants.js";

describe('Catch the Google game tests', () => {

    let game
    beforeEach(() => {
        game = new Game();
    })

    afterEach(async () => {
        await game.gameStop()
    })

    it('New setting must be applied to Game', () => {
        game.settings = {gridSize: {x: 4, y: 5}}
        const settings = game.settings
        expect(settings.gridSize.x).toBe(4)
        expect(settings.gridSize.y).toBe(5)
    })

    it('Game gameStart test', async () => {
        expect(game.gameStatus).toBe(STATUS.PENDING)

        await game.gameStart()
        expect(game.gameStatus).toBe(STATUS.IN_PROGRESS)

        await game.gameStop()
        expect(game.gameStatus).toBe(STATUS.STOPPED)

        await game.gameFinish()
        expect(game.gameStatus).toBe(STATUS.FINISHED)
    })

    it('Game Players amount applied to game settings, all players created since game start', async () => {
        game.settings = {
            playersAmount: 5,
            gridSize: {x: 5, y: 7}
        }

        await game.gameStart()
        expect(Object.keys(game.players).length).toBe(5)
    })

    it('Check Players initial positions are not crossed with each other', async () => {

        for (let i = 0; i < 30; i++) {
            game.settings = {
                playersAmount: 3,
                gridSize: {x: 1, y: 4}
            };
            await game.gameStart();

            for (let j = 1; j <= game.settings.playersAmount; j++) {

                expect([1]).toContain(game.players[`player${j}`].position.x);
                expect([1, 2, 3, 4]).toContain(game.players[`player${j}`].position.y);
                expect(createRange(1, game.settings.playersAmount + 1)).toContain(game.players[`player${j}`].position.y);
            }

            let positionsOverlap = false;
            for (let j = 1; j <= game.settings.playersAmount; j++) {
                for (let k = j + 1; k <= game.settings.playersAmount; k++) {
                    if (game.players[`player${j}`].position.x === game.players[`player${k}`].position.x &&
                        game.players[`player${j}`].position.y === game.players[`player${k}`].position.y) {
                        positionsOverlap = true;
                    }
                }
            }
            expect(positionsOverlap).toBe(false);
            game.gameStop();
        }

        // for (let i = 0; i < 30; i++) {
        // game.settings = {gridSize: {x: 1, y: 3}}
        // await game.gameStart()
        // expect([1]).toContain(game.players[0].position.x)
        // expect([1, 2, 3]).toContain(game.players[0].position.y)
        // expect([1]).toContain(game.players[1].position.x)
        // expect([1, 2, 3]).toContain(game.players[1].position.y)
        // expect(game.players[0].position.x !== game.players[1].position.x
        //     || game.players[0].position.y !== game.players[1].position.y).toBe(true)
        //
        // game.gameStop()
        // }

    })

    it('Check Google initial position not crossed with players', async () => {
        for (let i = 0; i < 30; i++) {
            game = new Game()
            game.settings = {
                playersAmount: 2,
                gridSize: {x: 1, y: 3}
            }
            await game.gameStart()

            expect([1]).toContain(game.google.position.x)
            expect([1, 2, 3]).toContain(game.google.position.y)

            expect(
                (game.google.position.x !== game.players['player1'].position.x ||
                    game.google.position.y !== game.players['player1'].position.y) &&
                (game.google.position.x !== game.players['player2'].position.x ||
                    game.google.position.y !== game.players['player2'].position.y)
            ).toBe(true)
            game.gameStop()
        }
    })

    it('Check Google changed it\'s position after jump', async () => {
        for (let i = 0; i < 30; i++) {
            game = new Game()
            game.settings = {
                gridSize: {x: 1, y: 10},
                googleJumpInterval: 100,
                gameMode: 'test'
            }
            await game.gameStart()

            const prevGooglePosition = game.google.position.clone()

            await sleep(150)

            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
            game.gameStop()
        }
    })

    it('Catch Google by Player1 or Player2 in one row', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {x: 3, y: 1},
                playersAmount: 2,
                googleJumpInterval: 1000,
                gameMode: 'test'
            }

            await game.gameStart()

            const prevGooglePosition = game.google.position.clone()
            // possible combinations: p1 p2 g | p1 g p2 | g p1 p2 | g p2 p1 | p2 p1 g
            const delta = game.google.position.x - game.players['player1'].position.x
            if (Math.abs(delta) === 1) {
                if (delta > 0) {
                    game.movePlayer('player1', STEP_SIZE.RIGHT)
                } else {
                    game.movePlayer('player1', STEP_SIZE.LEFT)
                }
                expect(game.score['player1'].points).toBe(1)
                expect(game.score['player2'].points).toBe(0)
            } else {
                if (delta > 0) {
                    game.movePlayer('player2', STEP_SIZE.RIGHT)
                }
                if (delta < 0) {
                    game.movePlayer('player2', STEP_SIZE.LEFT)
                }
                expect(game.score['player1'].points).toBe(0)
                expect(game.score['player2'].points).toBe(1)
            }

            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
            game.gameStop()
        }
    })

    it('Catch Google by Player1 or Player2 in one column', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {x: 1, y: 3},
                playersAmount: 2,
                googleJumpInterval: 100,
                gameMode: 'test'
            }

            await game.gameStart()

            const prevGooglePosition = game.google.position.clone()
            // possible combinations:
            // p1 | p1 | g  | g  | p2
            // p2 | g  | p1 | p2 | p1
            // g  | p2 | p2 | p1 | g
            const delta = game.google.position.y - game.players['player1'].position.y
            if (Math.abs(delta) === 1) {
                if (delta > 0) {
                    game.movePlayer('player1', STEP_SIZE.DOWN)
                } else {
                    game.movePlayer('player1', STEP_SIZE.UP)
                }
                expect(game.score['player1'].points).toBe(1)
                expect(game.score['player2'].points).toBe(0)

            } else {
                if (delta > 0) {
                    game.movePlayer('player2', STEP_SIZE.DOWN)
                }
                if (delta < 0) {
                    game.movePlayer('player2', STEP_SIZE.UP)
                }
                expect(game.score['player1'].points).toBe(0)
                expect(game.score['player2'].points).toBe(1)
            }

            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
            game.gameStop()
        }
    })

    it('Some Player must win', async () => {
        game.settings = {
            gridSize: {x: 3, y: 1},
            playersAmount: 2,
            googleJumpInterval: 100,
            pointsToWin: 3,
            gameMode: 'test'
        }

        await game.gameStart()
        expect(game.gameStatus).toBe(STATUS.IN_PROGRESS)
        // possible combinations: p1 p2 g | p1 g p2 | g p1 p2 | g p2 p1 | p2 p1 g
        const delta = game.google.position.x - game.players['player1'].position.x
        if (Math.abs(delta) === 1) {
            if (delta > 0) {
                game.movePlayer('player1', STEP_SIZE.RIGHT)
                game.movePlayer('player1', STEP_SIZE.LEFT)
                game.movePlayer('player1', STEP_SIZE.RIGHT)
            } else {
                game.movePlayer('player1', STEP_SIZE.LEFT)
                game.movePlayer('player1', STEP_SIZE.RIGHT)
                game.movePlayer('player1', STEP_SIZE.LEFT)
            }
            expect(game.score['player1'].points).toBe(3)
            expect(game.score['player2'].points).toBe(0)
        } else {
            if (delta > 0) {
                game.movePlayer('player2', {x: 1, y: 0})
                game.movePlayer('player2', {x: -1, y: 0})
                game.movePlayer('player2', {x: 1, y: 0})
            }
            if (delta < 0) {
                game.movePlayer('player2', {x: -1, y: 0})
                game.movePlayer('player2', {x: 1, y: 0})
                game.movePlayer('player2', {x: -1, y: 0})
            }
            expect(game.score['player1'].points).toBe(0)
            expect(game.score['player2'].points).toBe(3)
            game.gameFinish()
            expect(game.gameStatus).toBe(STATUS.FINISHED)
        }
    })

    // it('Catch Google by Player1 or Player2 in one row', async () => {
    //     for (let i = 0; i < 10; i++) {
    //         game = new Game()
    //         game.settings = {
    //             gridSize: {x: 3, y: 1},
    //             googleJumpInterval: 100,
    //             gameMode: true
    //         }
    //
    //         await game.gameStart()
    //
    //         const prevGooglePosition = game.google.position.clone()
    //         // possible combinations: p1 p2 g | p1 g p2 | g p1 p2 | g p2 p1 | p2 p1 g
    //         const delta = game.google.position.x - game.players[0].position.x
    //         if (Math.abs(delta) === 1) {
    //             if (delta > 0) {
    //                 game.movePlayer(game.players[0], STEP_SIZE.RIGHT)
    //             } else {
    //                 game.movePlayer(game.players[0], STEP_SIZE.LEFT)
    //             }
    //             expect(game.score[game.players[0].id].points).toBe(1)
    //             expect(game.score[game.players[1].id].points).toBe(0)
    //         } else {
    //             if (delta > 0) {
    //                 game.movePlayer(game.players[1], STEP_SIZE.RIGHT)
    //             }
    //             if (delta < 0) {
    //                 game.movePlayer(game.players[1], STEP_SIZE.LEFT)
    //             }
    //             expect(game.score[game.players[0].id].points).toBe(0)
    //             expect(game.score[game.players[1].id].points).toBe(1)
    //         }
    //
    //         expect(game.google.position.equal(prevGooglePosition)).toBe(false)
    //         game.gameStop()
    //     }
    // })
    //
    // it('Catch Google by Player1 or Player2 in one column', async () => {
    //     for (let i = 0; i < 10; i++) {
    //         game = new Game()
    //         game.settings = {
    //             gridSize: {x: 1, y: 3},
    //             googleJumpInterval: 100,
    //             gameMode: true
    //         }
    //
    //         await game.gameStart()
    //
    //         const prevGooglePosition = game.google.position.clone()
    //         // possible combinations:
    //         // p1 | p1 | g  | g  | p2
    //         // p2 | g  | p1 | p2 | p1
    //         // g  | p2 | p2 | p1 | g
    //         const delta = game.google.position.y - game.players[0].position.y
    //         if (Math.abs(delta) === 1) {
    //             if (delta > 0) {
    //                 game.movePlayer(game.players[0], STEP_SIZE.DOWN)
    //             } else {
    //                 game.movePlayer(game.players[0], STEP_SIZE.UP)
    //             }
    //             expect(game.score[game.players[0].id].points).toBe(1)
    //             expect(game.score[game.players[1].id].points).toBe(0)
    //         } else {
    //             if (delta > 0) {
    //                 game.movePlayer(game.players[1], STEP_SIZE.DOWN)
    //             }
    //             if (delta < 0) {
    //                 game.movePlayer(game.players[1], STEP_SIZE.UP)
    //             }
    //             expect(game.score[game.players[0].id].points).toBe(0)
    //             expect(game.score[game.players[1].id].points).toBe(1)
    //         }
    //
    //         expect(game.google.position.equal(prevGooglePosition)).toBe(false)
    //         game.gameStop()
    //     }
    // })
    //
    // it('Some Player must win', async () => {
    //     game.settings = {
    //         gridSize: {x: 3, y: 1},
    //         googleJumpInterval: 100,
    //         pointsToWin: 3,
    //         gameMode: true
    //     }
    //
    //     await game.gameStart()
    //     expect(game.gameStatus).toBe(STATUS.IN_PROGRESS)
    //     // possible combinations: p1 p2 g | p1 g p2 | g p1 p2 | g p2 p1 | p2 p1 g
    //     const delta = game.google.position.x - game.players[0].position.x
    //     if (Math.abs(delta) === 1) {
    //         if (delta > 0) {
    //             game.movePlayer(game.players[0], STEP_SIZE.RIGHT)
    //             game.movePlayer(game.players[0], STEP_SIZE.LEFT)
    //             game.movePlayer(game.players[0], STEP_SIZE.RIGHT)
    //         } else {
    //             game.movePlayer(game.players[0], STEP_SIZE.LEFT)
    //             game.movePlayer(game.players[0], STEP_SIZE.RIGHT)
    //             game.movePlayer(game.players[0], STEP_SIZE.LEFT)
    //         }
    //         console.log('score: ', game.score)
    //         expect(game.score[game.players[0].id].points).toBe(3)
    //         expect(game.score[game.players[1].id].points).toBe(0)
    //     } else {
    //         if (delta > 0) {
    //             game.movePlayer(game.players[1], STEP_SIZE.DOWN)
    //             game.movePlayer(game.players[1], STEP_SIZE.UP)
    //             game.movePlayer(game.players[1], STEP_SIZE.DOWN)
    //         }
    //         if (delta < 0) {
    //             game.movePlayer(game.players[1], STEP_SIZE.UP)
    //             game.movePlayer(game.players[1], STEP_SIZE.DOWN)
    //             game.movePlayer(game.players[1], STEP_SIZE.UP)
    //         }
    //         console.log('score: ', game.score)
    //         expect(game.score[game.players[0].id].points).toBe(0)
    //         expect(game.score[game.players[1].id].points).toBe(3)
    //     }
    //     game.gameFinish()
    //     expect(game.gameStatus).toBe(STATUS.FINISHED)
    // })

    it('Player position mustn\'t be changed', async () => {
        await game.gameStart()
        const player = game.players['player1']
        const prevX = game.players['player1'].position.x
        game.players['player1'].position.x = 100
        expect(game.players['player1'].position.x).toBe(prevX)
    })
})

const sleep = ms => new Promise(res => setTimeout(res, ms))
const createRange = (x, y) => Array.from({length: y - x + 1}, (_, index) => x + index);