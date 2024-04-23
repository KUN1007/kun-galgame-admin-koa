import { type Context } from 'koa'
import UpdateLogService from '@/service/updateLogService'
import AdminInfoService from '@/service/adminInfoService'

class UpdateLogController {
  async createUpdateLog(ctx: Context) {
    const { type, content, time, version } = ctx.request.body
    await UpdateLogService.createUpdateLog(type, content, time, version)

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} created an update log\nUpdate Version: ${version}`
    )
  }

  async getUpdateLogs(ctx: Context) {
    const page = ctx.query.page as string
    const limit = ctx.query.limit as string

    ctx.body = await UpdateLogService.getUpdateLogs(
      parseInt(page),
      parseInt(limit)
    )
  }

  async updateUpdateLog(ctx: Context) {
    const { upid, contentEn, contentZh, version } = ctx.request.body
    await UpdateLogService.updateUpdateLog(upid, contentEn, contentZh, version)
  }

  async deleteUpdateLog(ctx: Context) {
    const upid = parseInt(ctx.query.upid as string)
    await UpdateLogService.deleteUpdateLog(upid)
  }
}

export default new UpdateLogController()
