import type { UserAttributes } from './user'

export type MessageType =
  | 'upvoted'
  | 'liked'
  | 'favorite'
  | 'replied'
  | 'commented'
  | 'expired'
  | 'requested'
  | 'merged'
  | 'declined'
  | 'mentioned'
  | 'admin'

export type MessageStatus = 'read' | 'unread'

export interface MessageAttributes {
  mid: number
  sender_uid: number
  receiver_uid: number
  time: number
  tid: number
  gid: number
  content: string
  status: MessageStatus
  type: MessageType

  user: UserAttributes[]

  created: Date
  updated: Date
}
