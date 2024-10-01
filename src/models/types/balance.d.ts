export interface Balance {
  bid: number
  reason: KunLanguage
  type: string
  time: number
  amount: number
  status: number

  created: Date
  updated: Date
}

export interface SearchBalance {
  type: number
  start: number
  end: number
  min: number
  max: number
  limit: number
  page: number
}
