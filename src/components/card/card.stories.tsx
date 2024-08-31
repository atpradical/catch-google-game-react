import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './card'

const meta = {
  argTypes: {
    as: {
      control: { type: 'radio' },
      options: ['div', 'article', 'section', 'aside'],
    },
    style: {
      control: {
        fields: {
          height: {
            control: { type: 'text' },
          },
          width: {
            control: { type: 'text' },
          },
        },
        type: 'object',
      },
    },
  },
  component: Card,
  tags: ['autodocs'],
  title: 'Primitives/Card',
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const CardSample: Story = {
  args: {
    style: {
      height: '288px',
      width: '420px',
    },
  },
}
