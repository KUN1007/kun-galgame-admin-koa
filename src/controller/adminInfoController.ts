import { Context } from 'koa'
import AdminInfoService from '@/service/adminInfoService'

class AdminInfoController {
  async getAdminInfos(ctx: Context) {
    const page = ctx.query.page as string
    const limit = ctx.query.limit as string
    ctx.body = await AdminInfoService.getAdminInfo(
      parseInt(page),
      parseInt(limit)
    )
  }
}

export default new AdminInfoController()
