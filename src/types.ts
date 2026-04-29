export type AnimationType = 'none' | 'fade' | 'float' | 'slide' | 'pulse'

export interface Postcard {
  id: string
  message: string
  from: string
  location: string
  template: string
  stickers: string[]
  font: string
  anim: AnimationType
  ts: number
  groupId?: string
  image?: string  
}

export interface Group {
  id: string
  name: string
  code: string
  members: number
  postcards: Postcard[]
  createdAt: number
}
