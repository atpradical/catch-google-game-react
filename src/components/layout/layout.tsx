import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import s from './layout.module.scss'
import { Header } from '../header'
import { GameSettings } from '@/App'

type LayoutProps = ComponentPropsWithoutRef<'main'> & {
  onSettingsChange: (settings: Partial<GameSettings>) => void
  disabled: boolean
}

type RefProps = ElementRef<'main'>

export const Layout = forwardRef<RefProps, LayoutProps>(
  ({ disabled, onSettingsChange, ...props }, ref) => {
    return (
      <>
        <Header onSettingsChange={onSettingsChange} disabled={disabled} />
        <main className={s.layout} ref={ref} {...props} />
      </>
    )
  }
)
