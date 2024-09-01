import type { Meta, StoryObj } from '@storybook/react'

import { TableBody, TableCell, TableContainer, TableRow } from './table'
import { mockTableData } from './table.mock'

const meta = {
  argTypes: {},
  component: TableContainer,
  tags: ['autodocs'],
  title: 'Primitives/Table',
} satisfies Meta<typeof TableContainer>

type Story = StoryObj<typeof meta>
export default meta

export const Table: Story = {
  args: {},
  render: () => {
    return (
      <TableContainer>
        <TableBody>
          {mockTableData.map(el => {
            return (
              <TableRow>
                <TableCell>{el.id}</TableCell>
                <TableCell>{el.id}</TableCell>
                <TableCell>{el.id}</TableCell>
                <TableCell>{el.id}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </TableContainer>
    )
  },
}
