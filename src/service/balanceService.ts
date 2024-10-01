import BalanceModel from '@/models/balance'
import type { Balance, SearchBalance } from '@/models/types/balance'

class BalanceService {
  async createBalance(
    isIncome: boolean,
    money: number,
    reasonText: KunLanguage,
    dealTime: number,
    status: number
  ): Promise<void> {
    await BalanceModel.create({
      type: isIncome ? 'income' : 'expenditure',
      reason: reasonText,
      amount: money,
      status,
      time: dealTime
    })
  }

  mapBalance(balances: Balance[]) {
    return balances.map(({ bid, reason, type, time, amount, status }) => ({
      bid,
      reason,
      type: type === 'income',
      time,
      amount,
      status
    }))
  }

  async getBalance() {
    const balances = await BalanceModel.find()
    return this.mapBalance(balances)
  }

  async getBalanceByType(type: number) {
    const keyword = type > 0 ? 'income' : 'expenditure'
    const balances = await BalanceModel.find({ type: keyword })
    return this.mapBalance(balances)
  }

  async getBalanceByAmount({ type, min, max }: SearchBalance) {
    const query: any = { amount: { $gte: min, $lte: max } }
    if (type !== 2) {
      query.type = type > 0 ? 'income' : 'expenditure'
    }
    const balances = await BalanceModel.find(query)
    return this.mapBalance(balances)
  }

  async getBalanceLimit(page: number, limit: number) {
    const skip = (page - 1) * limit
    const balances = await BalanceModel.find().skip(skip).limit(limit)
    return this.mapBalance(balances)
  }

  private buildConditions({ type, min, max, start, end }: SearchBalance): any {
    const conditions: any = {
      amount: { $gte: min, $lte: max },
      time: { $gte: start, $lte: end }
    }
    if (type !== 2) {
      conditions.type = type > 0 ? 'income' : 'expenditure'
    }
    return conditions
  }

  async getBalanceByConditions(request: SearchBalance) {
    const conditions = this.buildConditions(request)
    const balances = await BalanceModel.find(conditions)
    return this.mapBalance(balances)
  }

  async getBalanceByConditionsLimit(request: SearchBalance) {
    const skip = (request.page - 1) * request.limit
    const conditions = this.buildConditions(request)
    const balances = await BalanceModel.find(conditions)
      .skip(skip)
      .limit(request.limit)
    return this.mapBalance(balances)
  }

  async deleteBalance(bid: number): Promise<void> {
    await BalanceModel.deleteOne({ bid })
  }

  async updateBalance(bid: number, data: Partial<Balance>): Promise<void> {
    await BalanceModel.updateOne({ bid }, data)
  }
}

export default new BalanceService()
