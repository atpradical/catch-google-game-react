import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import clsx from 'clsx'

import s from './header.module.scss'
import { Card } from '../card'
import { Select } from '../select'
import GoogleIcon from '../../assets/components/google-icon'
import { GameSettings } from '@/App'
import { parseGameGridString } from '../../utils/parseGameGridString'
import { MODE } from '../../utils/common.ts'

type Props = ComponentPropsWithoutRef<typeof Card> & {
  onSettingsChange: (settings: Partial<GameSettings>) => void
}

type PropsRef = ElementRef<typeof Card>

const gridSize = ['4x4', '5x5', '6x6']
const timeLimit = ['30', '45', '60', '90']
const gameMode = ['single', 'multiplayer']

export const Header = forwardRef<PropsRef, Props>((props, ref) => {
  const { disabled, onSettingsChange, className, ...rest } = props

  const cn = clsx(s.header, className)

  const changeGridSizeHandler = (gridSize: string) => {
    onSettingsChange({ gridSize: parseGameGridString(gridSize) })
  }

  const changeTimerHandler = (gameTimer: string) => {
    onSettingsChange({ gameTimer: +gameTimer * 1000 })
  }

  const changePointsToWinHandler = (pointsToWin: string) => {
    onSettingsChange({ pointsToWin: +pointsToWin })
  }

  const changeModeHandler = (gameMode: string) => {
    const playersAmount = gameMode === MODE.SINGLE ? 1 : 2
    onSettingsChange({ gameMode, playersAmount })
  }

  return (
    <Card as={'header'} className={cn} {...rest} ref={ref}>
      <div className={s.container}>
        <GoogleIcon />
        <div className={s.settings}>
          <Select
            disabled={disabled}
            defaultValue={'4x4'}
            onValueChange={changeGridSizeHandler}
            label={'Grid size'}
            options={gridSize}
          />
          <Select
            disabled={disabled}
            defaultValue={'20'}
            onValueChange={changePointsToWinHandler}
            label={'Points to win'}
          />
          <Select
            disabled={disabled}
            defaultValue={'30'}
            onValueChange={changeTimerHandler}
            label={'Timer (seconds)'}
            options={timeLimit}
          />
          <Select
            disabled={disabled}
            defaultValue={'single'}
            onValueChange={changeModeHandler}
            label={'Game mode'}
            options={gameMode}
          />
        </div>
      </div>
    </Card>
  )
})
