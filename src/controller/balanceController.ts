import { type Context } from 'koa'
import BalanceService from '@/service/balanceService'
import { SearchBalance } from '@/models/types/balance'

class BalanceController {
  async CreateBalance(ctx: Context) {
    const { type, amount, reason, time, status } = ctx.request.body
    await BalanceService.createBalance(type, amount, reason, time, status)
  }

  async GetBalance(ctx: Context) {
    const req: SearchBalance = {
      type: parseInt(ctx.query.type as string),
      start: parseInt(ctx.query.start as string),
      end: parseInt(ctx.query.end as string),
      min: parseInt(ctx.query.min as string),
      max: parseInt(ctx.query.max as string),
      page: parseInt(ctx.query.page as string),
      limit: parseInt(ctx.query.limit as string)
    }

    if (
      req.type <= 2 &&
      req.start > 0 &&
      req.end > 0 &&
      req.min > 0 &&
      req.max > 0
    ) {
      if (req.page > 0 && req.limit > 0)
        ctx.body = await BalanceService.getBalanceByConditionsLimit(req)
      else ctx.body = await BalanceService.getBalanceByConditions(req)
    } else if (req.type < 2 && req.start === 0 && req.min === 0) {
      ctx.body = await BalanceService.getBalanceByType(req.type)
    } else if (req.min > 0 && req.max > 0) {
      ctx.body = await BalanceService.getBalanceByAmount(req)
    } else {
      ctx.body = await BalanceService.getBalance()
    }
  }

  async DeleteBalance(ctx: Context) {
    const { bid } = ctx.params
    await BalanceService.deleteBalance(bid)
  }

  async UpdateBalance(ctx: Context) {
    const { bid } = ctx.params
    const data = ctx.request.body
    await BalanceService.updateBalance(bid, data)
  }
}

export default new BalanceController()
