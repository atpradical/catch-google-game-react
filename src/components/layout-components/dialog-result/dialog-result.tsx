import { Button } from '../../button'
import { Dialog, DialogClose, DialogContent, DialogDescription } from '../../dialog'
import { Typography } from '../../typography'
import { ComponentPropsWithoutRef } from 'react'

import s from './dialog-result.module.scss'
import { Title } from '@radix-ui/react-dialog'

type DialogResultProps = ComponentPropsWithoutRef<typeof Dialog> & {
  winner: string
}
export const DialogResult = ({ winner, ...props }: DialogResultProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <Title />
        <DialogDescription title={'winner'}>
          <Typography variant={'subtitle1'}>{`${winner} win!`}</Typography>
          <DialogClose asChild>
            <Button variant={'link'} className={s.close}>
              X
            </Button>
          </DialogClose>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
