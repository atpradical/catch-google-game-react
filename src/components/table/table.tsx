import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import clsx from 'clsx'

import s from './table.module.scss'

import { Typography } from '../typography'

type TableContainerProps = {
  label?: string
} & ComponentPropsWithoutRef<'table'>

type TableContainerRef = ElementRef<'table'>

const TableContainer = forwardRef<TableContainerRef, TableContainerProps>((props, ref) => {
  const { children, className, ...rest } = props
  const cn = clsx(s.table, className)

  return (
    <table className={cn} ref={ref} {...rest}>
      {children}
    </table>
  )
})

type TableBodyProps = ComponentPropsWithoutRef<'tbody'>
type TableBodyRef = ElementRef<'tbody'>

const TableBody = forwardRef<TableBodyRef, TableBodyProps>((props, ref) => {
  const { children, className, ...rest } = props
  const cn = clsx(s.cell, className)

  return (
    <tbody className={cn} ref={ref} {...rest}>
      {children}
    </tbody>
  )
})

type TableRowProps = ComponentPropsWithoutRef<'tr'>
type TableRowRef = ElementRef<'tr'>

const TableRow = forwardRef<TableRowRef, TableRowProps>((props, ref) => {
  const { children, className, ...rest } = props
  const cn = clsx(s.tableRow, className)

  return (
    <tr className={cn} ref={ref} {...rest}>
      {children}
    </tr>
  )
})

type TableCellProps = ComponentPropsWithoutRef<'td'>
type TableCellRef = ElementRef<'td'>

const TableCell = forwardRef<TableCellRef, TableCellProps>((props, ref) => {
  const { children, className, ...rest } = props
  const cn = clsx(s.cell, className)

  return (
    <td className={cn} ref={ref} {...rest}>
      <Typography as={'span'}>{children}</Typography>
    </td>
  )
})

export { TableBody, TableCell, TableContainer, TableRow }
