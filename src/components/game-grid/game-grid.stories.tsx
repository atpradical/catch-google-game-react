import type { Meta, StoryObj } from '@storybook/react'
import { GameGrid } from './game-grid.tsx'

const meta = {
  argTypes: {},
  component: GameGrid,
  tags: ['autodocs'],
  title: 'Primitives/GameGrid',
} satisfies Meta<typeof GameGrid>

type Story = StoryObj<typeof meta>
export default meta

export const Table: Story = {}
