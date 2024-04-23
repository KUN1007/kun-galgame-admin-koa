import type { UserAttributes } from './user'

export interface TodoAttributes {
  todo_id: number
  status: number
  content: KunLanguage
  creator_uid: number
  time: number
  completer_uid: number
  completed_time: number

  creator: UserAttributes[]
  completer: UserAttributes[]

  created: Date
  updated: Date
}
