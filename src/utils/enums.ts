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
