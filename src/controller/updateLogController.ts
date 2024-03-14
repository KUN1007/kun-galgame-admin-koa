import { Context } from 'koa'
import UpdateLogService from '@/service/updateLogService'
import AdminInfoService from '@/service/adminInfoService'

class UpdateLogController {
  async createUpdateLog(ctx: Context) {
    const { type, description, language, time, version } = ctx.request.body
    ctx.body = await UpdateLogService.createUpdateLog(
      type,
      description,
      language,
      time,
      version
    )

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} create an update log\nUpdate Version: ${version}`
    )
  }

  async getUpdateLogs(ctx: Context) {
    const page = ctx.query.page as string
    const limit = ctx.query.limit as string
    const language = ctx.query.language as Language
    ctx.body = await UpdateLogService.getUpdateLogs(
      parseInt(page),
      parseInt(limit),
      language
    )
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
