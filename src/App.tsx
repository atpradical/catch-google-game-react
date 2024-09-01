import { Button, GameGrid, ScoreBoard } from './components'
import { Layout } from './components/layout'

import { Game } from './game'
import { Controller } from './controller'
import { EventEmitter } from './EventEmitter'
import { useEffect, useRef, useState } from 'react'
import {
  defaultSettings,
  GameSettings,
  MODE,
  PLAYERS,
  Scores,
  STATUS,
  STEP_SIZE,
} from './utils/common'
import { DialogResult } from './components/layout-components/dialog-result/dialog-result'

export function App() {
  // Используем useRef для хранения экземпляров Game и EventEmitter
  const gameRef = useRef<Game | null>(null)
  const eventEmitterRef = useRef<EventEmitter | null>(null)
  const controllerRef = useRef<Controller | null>(null)

  // Создаем экземпляры только один раз
  if (!gameRef.current) {
    eventEmitterRef.current = new EventEmitter()
    gameRef.current = new Game(eventEmitterRef.current)
    controllerRef.current = new Controller(gameRef.current)
    console.dir('gameRef.current is ', gameRef)
  }

  const eventEmitter = eventEmitterRef.current
  const controller = controllerRef.current

  const [gameSettings, setGameSettings] = useState<GameSettings>(defaultSettings)
  const [userGameSettings, setUserGameSettings] = useState<GameSettings>(defaultSettings)
  const [gameStatus, setGameStatus] = useState(STATUS.PENDING)
  const [googleData, setGoogleData] = useState()
  const [playerOne, setPlayerOne] = useState()
  const [playerTwo, setPlayerTwo] = useState()
  const [scores, setScores] = useState<Scores | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [gameWinner, setGameWinner] = useState()

  const startGameHandler = async () => {
    controller?.setGameSettings(gameSettings)
    await controller?.startGame()
    setGoogleData(controller?.getGoogleData())
    setPlayerOne(controller?.getPlayerData('player1'))
    setPlayerTwo(controller?.getPlayerData('player2'))
    setScores(controller?.getGameScore())
  }

  const restartGameHandler = async () => {
    controller?.setGameSettings(userGameSettings)
    await controller?.startGame()
  }

  useEffect(() => {
    const gameDataChanged = async () => {
      setGoogleData(controller?.getGoogleData())
      setPlayerOne(controller?.getPlayerData('player1'))
      setPlayerTwo(controller?.getPlayerData('player2'))
      setGameSettings(prevSettings => ({ ...prevSettings, ...controller?.getGameSettings() }))
      setGameStatus(controller?.getGameStatus())
      setScores(await controller?.getGameScore())
    }

    eventEmitter?.subscribe('change', gameDataChanged)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const playersControlsHandlers: Record<string, () => void> = {
      ArrowUp: () => controller?.movePlayer(PLAYERS.ONE, STEP_SIZE.UP),
      ArrowDown: () => controller?.movePlayer(PLAYERS.ONE, STEP_SIZE.DOWN),
      ArrowLeft: () => controller?.movePlayer(PLAYERS.ONE, STEP_SIZE.LEFT),
      ArrowRight: () => controller?.movePlayer(PLAYERS.ONE, STEP_SIZE.RIGHT),

      KeyW: () => controller?.movePlayer(PLAYERS.TWO, STEP_SIZE.UP),
      KeyS: () => controller?.movePlayer(PLAYERS.TWO, STEP_SIZE.DOWN),
      KeyA: () => controller?.movePlayer(PLAYERS.TWO, STEP_SIZE.LEFT),
      KeyD: () => controller?.movePlayer(PLAYERS.TWO, STEP_SIZE.RIGHT),
    }

    const bindPlayersControls = (e: KeyboardEvent) => {
      const handler = playersControlsHandlers[e.code]
      if (handler) {
        handler()
      }
    }

    window.addEventListener('keydown', bindPlayersControls)

    return () => {
      window.removeEventListener('keydown', bindPlayersControls)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeGameSettingsHandler = (settings: Partial<GameSettings>) => {
    const newSettings = { ...gameSettings, ...settings }
    setGameSettings(newSettings)
    setUserGameSettings(newSettings)
    controller?.setGameSettings(newSettings)
  }

  const isInProgress = gameStatus === STATUS.IN_PROGRESS
  const isFinished = gameStatus === STATUS.FINISHED
  const isMultiplayer = gameSettings.gameMode === MODE.MULTIPLAYER

  useEffect(() => {
    if (isFinished) {
      setShowDialog(true)
      setGameWinner(controller?.getGameWinner())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished])

  return (
    <Layout onSettingsChange={changeGameSettingsHandler} disabled={isInProgress || isFinished}>
      {isInProgress && (
        <>
          <ScoreBoard
            scores={scores}
            remainTime={gameSettings.gameTimer}
            isMultiplayer={isMultiplayer}
          />
          <GameGrid
            gridSize={gameSettings.gridSize}
            player1={playerOne}
            player2={playerTwo}
            google={googleData}
          />
        </>
      )}
      {!isInProgress &&
        (isFinished ? (
          <Button onClick={restartGameHandler}>Repeat</Button>
        ) : (
          <Button onClick={startGameHandler}>Start</Button>
        ))}
      {showDialog && (
        <DialogResult
          onOpenChange={() => setShowDialog(false)}
          open={showDialog}
          winner={gameWinner ?? ''}
        />
      )}
    </Layout>
  )
}
