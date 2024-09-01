import { msToMMSS } from '@/utils/msToMMSS'
import { Typography } from '../../typography'
import clsx from 'clsx'

import s from './timer.module.scss'

const LAST_10_SECONDS = 10

type TimerProps = {
  remainTime: number
}

export const Timer = ({ remainTime }: TimerProps) => {
  const isLast10Seconds = remainTime / 1000 < LAST_10_SECONDS

  const cn = clsx(isLast10Seconds && s.red)

  return (
    <Typography variant={'subtitle1'} className={cn}>
      {msToMMSS(remainTime)}
    </Typography>
  )
}
