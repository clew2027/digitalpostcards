import type { Group } from '../types'

export const TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    bg: '#faf9f6',
    border: '#d8d4cc',
    accent: '#3d5a47',
    textColor: '#3d5a47',
  },
  {
    id: 'sage',
    name: 'Sage Garden',
    bg: '#e8f0ea',
    border: '#8aab8e',
    accent: '#2e5e36',
    textColor: '#2e5e36',
  },
  {
    id: 'dusk',
    name: 'Dusk',
    bg: '#ede9f5',
    border: '#9b8ec4',
    accent: '#4a3b8a',
    textColor: '#4a3b8a',
  },
  {
    id: 'sand',
    name: 'Desert Sand',
    bg: '#f5efe6',
    border: '#c4a87a',
    accent: '#7a4f2a',
    textColor: '#7a4f2a',
  },
  {
    id: 'slate',
    name: 'Slate',
    bg: '#e8ecf0',
    border: '#8aa0b4',
    accent: '#2a4a6a',
    textColor: '#2a4a6a',
  },
  {
    id: 'rose',
    name: 'Rose',
    bg: '#f5eaea',
    border: '#c48a8a',
    accent: '#7a2a2a',
    textColor: '#7a2a2a',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    bg: '#1a1c2a',
    border: '#3a3d55',
    accent: '#a0aee8',
    textColor: '#c8d0f0',
  },
  {
    id: 'linen',
    name: 'Linen',
    bg: '#f2ede4',
    border: '#c8b99a',
    accent: '#6b5a3e',
    textColor: '#6b5a3e',
  },
]

export const STICKERS = ['✦', '◇', '○', '△', '✿', '❋', '⌘', '◈', '⬡', '✶', '❍', '◉']

export const FONTS = [
  { id: 'dm-sans', label: 'Sans-serif', value: "'DM Sans', system-ui, sans-serif" },
  { id: 'serif', label: 'Serif', value: "'DM Serif Display', Georgia, serif" },
  { id: 'mono', label: 'Monospace', value: "'Courier New', Courier, monospace" },
]

export const ANIMATIONS = [
  { id: 'none', label: 'None' },
  { id: 'fade', label: 'Fade' },
  { id: 'float', label: 'Float' },
  { id: 'slide', label: 'Slide' },
  { id: 'pulse', label: 'Pulse' },
] as const


export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
