import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/button'
import { action } from '@storybook/addon-actions'

const meta = {
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'link'],
    },
  },
  component: Button,
  tags: ['autodocs'],
  title: 'Primitives/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    disabled: false,
    onClick: action('action on button click invoked'),
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    disabled: false,
    onClick: action('action on button click invoked'),
    variant: 'secondary',
  },
}

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    disabled: false,
    onClick: action('action on button click invoked'),
    variant: 'danger',
  },
}

export const ButtonAsLink: Story = {
  args: {
    as: 'a',
    children: 'Button as Link',
    href: 'https://google.com',
    onClick: action('action on button click invoked'),
    target: '_blank',
  },
}
