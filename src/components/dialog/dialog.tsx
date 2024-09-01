import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'

import s from './dialog.module.scss'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
type DialogOverlayRef = ElementRef<typeof DialogPrimitive.Overlay>
const DialogOverlay = forwardRef<DialogOverlayRef, DialogOverlayProps>(
  ({ className, ...rest }, ref) => {
    const cn = clsx(s.overlay, className)

    return <DialogPrimitive.Overlay className={cn} ref={ref} {...rest} />
  }
)

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
type DialogContentRef = ElementRef<typeof DialogPrimitive.Content>
const DialogContent = forwardRef<DialogContentRef, DialogContentProps>(
  ({ className, ...rest }, ref) => {
    const cn = clsx(s.content, className)

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className={cn} ref={ref} {...rest} />
      </DialogPortal>
    )
  }
)

DialogContent.displayName = DialogPrimitive.Content.displayName

type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
type DialogDescriptionRef = ElementRef<typeof DialogPrimitive.Description>
const DialogDescription = forwardRef<DialogDescriptionRef, DialogDescriptionProps>(
  ({ className, ...rest }, ref) => {
    const cn = clsx(s.description, className)

    return <DialogPrimitive.Description className={cn} ref={ref} {...rest} />
  }
)

DialogDescription.displayName = DialogPrimitive.Description.displayName

type DialogHeaderProps = ComponentPropsWithoutRef<'div'>
const DialogHeader = ({ children, className, ...rest }: DialogHeaderProps) => {
  const cn = clsx(s.header, className)

  return (
    <div className={cn} {...rest}>
      {children}
    </div>
  )
}

type DialogBodyProps = ComponentPropsWithoutRef<'div'>
const DialogBody = ({ children, className, ...rest }: DialogBodyProps) => {
  const cn = clsx(s.body, className)

  return (
    <div className={cn} {...rest}>
      {children}
    </div>
  )
}

type DialogFooterProps = ComponentPropsWithoutRef<'div'>
const DialogFooter = ({ children, className, ...rest }: DialogFooterProps) => {
  const cn = clsx(s.footer, className)

  return (
    <div className={cn} {...rest}>
      {children}
    </div>
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
}
