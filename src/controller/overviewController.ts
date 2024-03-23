import { type Context } from 'koa'
import OverviewService from '@/service/overviewService'

type ModelName = 'topic' | 'reply' | 'comment' | 'user'

class OverviewController {
  async getSumData(ctx: Context) {
    ctx.body = await OverviewService.getSumData()
  }

  async getOverviewData(ctx: Context) {
    const days = ctx.query.days as string
    ctx.body = await OverviewService.getOverviewData(parseInt(days))
  }

  async getWeekData(ctx: Context) {
    const days = ctx.query.days as string
    const model = ctx.query.model as ModelName
    ctx.body = await OverviewService.getLineChartData(parseInt(days), model)
  }
}

export default new OverviewController()
