import { ComponentPropsWithoutRef } from 'react'

import s from './game-grid.module.scss'
import { TableBody, TableCell, TableContainer, TableRow } from '../table'
import PlayerOne from '../../assets/components/player-one'
import PlayerTwo from '../../assets/components/player-two'
import GoogleIcon from '../../assets/components/google-icon'
import { Player, Unit } from '../../App'

type GameGridProps = ComponentPropsWithoutRef<'table'> & {
  gridSize: { x: number; y: number }
  player1?: Player
  player2?: Player
  google?: Unit
}

export const GameGrid = ({ gridSize, player1, player2, google }: GameGridProps) => {
  const rows = []

  for (let y = 1; y <= gridSize.y; y++) {
    const cells = []

    for (let x = 1; x <= gridSize.x; x++) {
      if (player1?.position.x === x && player1?.position.y === y) {
        cells.push(
          <TableCell key={`${x}-${y}`}>
            <PlayerOne />
          </TableCell>
        )
      } else if (player2?.position.x === x && player2?.position.y === y) {
        cells.push(
          <TableCell key={`${x}-${y}`}>
            <PlayerTwo />
          </TableCell>
        )
      } else if (google?.position.x === x && google?.position.y === y) {
        cells.push(
          <TableCell key={`${x}-${y}`}>
            <GoogleIcon />
          </TableCell>
        )
      } else {
        cells.push(<TableCell key={`${x}-${y}`}></TableCell>)
      }
    }
    rows.push(<TableRow key={y}>{cells}</TableRow>)
  }

  return (
    <div className={s.container}>
      <TableContainer>
        <TableBody>{rows}</TableBody>
      </TableContainer>
    </div>
  )
}
