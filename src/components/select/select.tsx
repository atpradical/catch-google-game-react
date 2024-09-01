import { ComponentPropsWithoutRef, ElementRef, forwardRef, useMemo } from 'react'
import s from './select.module.scss'

import ArrowForward from '../../assets/components/arrow-forward'
import { Typography } from '../typography'
import clsx from 'clsx'
import * as RadixSelect from '@radix-ui/react-select'

export type SelectProps = {
  className?: string
  label?: string
  onValueChange: (value: string) => void
  options?: string[]
  placeholder?: string
} & ComponentPropsWithoutRef<typeof RadixSelect.Root>

type SelectRef = ElementRef<typeof RadixSelect.Trigger>

export const Select = forwardRef<SelectRef, SelectProps>(
  (
    {
      className,
      defaultValue,
      disabled,
      label,
      onValueChange,
      options = ['10', '20', '30', '50', '100'],
      placeholder,
      value,
      ...rest
    },
    ref
  ) => {
    const cn = useMemo(
      () => ({
        container: s.container,
        disabled: s.disabled,
        dropdownArrow: s.dropdownArrow,
        label: clsx(s.label, disabled && s.disabled),
        placeholder: s.placeholder,
        selectContent: s.selectContent,
        selectOption: s.selectItem,
        selectTrigger: clsx(s.selectTrigger, className),
      }),
      [className, disabled]
    )

    const selectItems = useMemo(
      () =>
        options?.map((option, index) => (
          <RadixSelect.Item className={cn.selectOption} key={index + option} value={option}>
            <RadixSelect.ItemText>
              <Typography as={'span'}>{option}</Typography>
            </RadixSelect.ItemText>
          </RadixSelect.Item>
        )),
      [cn, options]
    )

    return (
      <RadixSelect.Root
        defaultValue={defaultValue}
        disabled={disabled}
        onValueChange={onValueChange}
        value={value}
        {...rest}
      >
        <div className={cn.container}>
          {label && (
            <Typography as={'label'} className={cn.label} variant={'caption'}>
              {label}
            </Typography>
          )}
          <RadixSelect.Trigger className={cn.selectTrigger} ref={ref}>
            <div className={s.flexContainer}>
              <RadixSelect.Value placeholder={placeholder ?? '...'} />
              <RadixSelect.Icon asChild className={cn.dropdownArrow}>
                <ArrowForward />
              </RadixSelect.Icon>
            </div>
          </RadixSelect.Trigger>
        </div>
        <RadixSelect.Portal>
          <RadixSelect.Content className={cn.selectContent} position={'popper'}>
            <RadixSelect.Viewport>
              <RadixSelect.Group>{selectItems}</RadixSelect.Group>
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    )
  }
)
