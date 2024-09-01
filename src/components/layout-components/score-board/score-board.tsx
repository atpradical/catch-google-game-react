import { Card } from '../../card'
import { Typography } from '../../typography'
import s from './score-board.module.scss'
import { Timer } from '../timer'
import { Scores } from '../../../utils/common'

type ScoreBarProps = {
  scores: Scores | null
  remainTime: number
  isMultiplayer: boolean
}

export const ScoreBoard = ({ remainTime, scores, isMultiplayer }: ScoreBarProps) => {
  return (
    <Card className={s.card}>
      <div className={s.container}>
        <Typography as={'span'}>
          Player1:{' '}
          <Typography as={'span'} variant={'subtitle1'} className={s.scoreCount}>{`${
            scores?.['player1']?.points ?? 0
          }`}</Typography>
        </Typography>
        {isMultiplayer && (
          <Typography as={'span'}>
            Player2:{' '}
            <Typography as={'span'} variant={'subtitle1'} className={s.scoreCount}>{`${
              scores?.['player2']?.points ?? 0
            }`}</Typography>
          </Typography>
        )}
        <Timer remainTime={remainTime} />
      </div>
    </Card>
  )
}
