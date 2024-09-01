export enum MODE {
  SINGLE = 'single',
  MULTIPLAYER = 'multiplayer',
}

export enum STATUS {
  'PENDING' = 'pending',
  'IN_PROGRESS' = 'in-progress',
  'FINISHED' = 'finished',
  'STOPPED' = 'stopped',
}

export const STEP_SIZE = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

export const PLAYERS = {
  ONE: 'player1',
  TWO: 'player2',
}

type Score = {
  points: number
}

export type Scores = Record<string, Score>

export type Position = {
  x: number
  y: number
}

export type Player = {
  id: number
  position: Position
  winner: boolean
}

export type Unit = Omit<Player, 'winner'>

export const defaultSettings: GameSettings = {
  playersAmount: 1,
  pointsToWin: 20,
  gameTimer: 30000,
  gridSize: { x: 4, y: 4 },
  gameMode: MODE.SINGLE,
}

export type GameSettings = {
  playersAmount: number
  pointsToWin: number
  gameTimer: number
  gridSize: Coordinates
  gameMode: GameMode
}

type Coordinates = {
  x: number
  y: number
}
type GameMode = MODE
