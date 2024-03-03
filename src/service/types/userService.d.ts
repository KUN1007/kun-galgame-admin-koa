export type SortOrder = 'asc' | 'desc'

export type SortFieldRanking =
  | 'moemoepoint'
  | 'upvote'
  | 'like'
  | 'topic_count'
  | 'reply_count'
  | 'comment_count'

export interface LoginResponseData {
  uid: number
  name: string
  avatar: string
  token: string
}
