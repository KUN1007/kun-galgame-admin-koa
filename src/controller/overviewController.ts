import { Context } from 'koa'
import OverviewService from '@/service/overviewService'

type Field = 'topic' | 'reply' | 'comment' | 'user'

class overviewController {
  async getOverviewData(ctx: Context) {
    const days = ctx.query.days as string
    ctx.body = await OverviewService.getOverviewData(parseInt(days))
  }

  async getWeekData(ctx: Context) {
    const days = ctx.query.days as string
    const field = ctx.query.field as Field
    ctx.body = await OverviewService.getWeekData(parseInt(days), field)
  }
}

export default new overviewController()
