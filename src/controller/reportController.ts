import { type Context } from 'koa'
import ReportService from '@/service/reportService'

class ReportController {
  async getReportList(ctx: Context) {
    ctx.body = await ReportService.getReportList(ctx.query as any)
  }

  async updateReportStatus(ctx: Context) {
    const { id, status } = ctx.request.body
    await ReportService.updateReportStatus(id, status)
  }
}

export default new ReportController()
