import { type Context } from 'koa'
import PLService from '@/service/plService'

type SortField = 'time' | 'amount'
type SortOrder = 'asc' | 'desc'

class PLController {
  async createIncome(ctx: Context) {
    const { reason, time, amount } = ctx.request.body

    const timeStamp = parseInt(time)
    await PLService.createIncome(reason, timeStamp, amount)
  }

  async createExpenditure(ctx: Context) {
    const { reason, time, amount } = ctx.request.body
    await PLService.createExpenditure(reason, time, amount)
  }

  async getIncomes(ctx: Context) {
    const page = parseInt(ctx.query.page as string)
    const limit = parseInt(ctx.query.limit as string)
    const sortField = ctx.query.sortField as SortField
    const sortOrder = ctx.query.sortOrder as SortOrder
    ctx.body = await PLService.getIncomes(page, limit, sortField, sortOrder)
  }

  async getExpenditures(ctx: Context) {
    const page = parseInt(ctx.query.page as string)
    const limit = parseInt(ctx.query.limit as string)
    const sortField = ctx.query.sortField as SortField
    const sortOrder = ctx.query.sortOrder as SortOrder

    ctx.body = await PLService.getExpenditures(
      page,
      limit,
      sortField,
      sortOrder
    )
  }

  async getPLStatement(ctx: Context) {
    ctx.body = await PLService.getPLStatement()
  }
}

export default new PLController()
