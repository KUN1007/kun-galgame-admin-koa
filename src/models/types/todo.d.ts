import type { UserAttributes } from './user'

export interface TodoAttributes {
  todo_id: number
  status: number
  content_en_us: string
  content_zh_cn: string
  creator_uid: number
  time: number
  completer_uid: number
  completed_time: number

  creator: UserAttributes[]
  completer: UserAttributes[]
}
