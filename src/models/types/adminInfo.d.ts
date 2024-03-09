import type { UserAttributes } from './user'

export interface AdminInfoAttributes {
  ai_id: number
  uid: number
  type: string
  content: string
  time: number

  sender: UserAttributes[]
}
