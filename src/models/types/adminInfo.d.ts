import type { UserAttributes } from './user'

export interface AdminInfoAttributes {
  ai_id: number
  uid: number
  content: string
  time: number

  sender: UserAttributes[]
}
