import { Context } from 'koa'
import UpdateLogService from '@/service/updateLogService'

class UpdateLogController {
  async createUpdateLog(ctx: Context) {
    const { body } = ctx.request
    ctx.body = await UpdateLogService.createUpdateLog(body)
  }

  async getUpdateLogs(ctx: Context) {
    const page = parseInt(ctx.query.page as string)
    const limit = parseInt(ctx.query.limit as string)
    ctx.body = await UpdateLogService.getUpdateLogs(page, limit)
  }

  async updateUpdateLog(ctx: Context) {
    const { upid, description, version } = ctx.request.body
    ctx.body = await UpdateLogService.updateUpdateLog(
      upid,
      description,
      version
    )
  }

  async deleteUpdateLog(ctx: Context) {
    const upid = parseInt(ctx.query.upid as string)
    ctx.body = await UpdateLogService.deleteUpdateLog(upid)
  }
}

export default new UpdateLogController()
