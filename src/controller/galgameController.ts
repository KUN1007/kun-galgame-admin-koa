import { type Context } from 'koa'
import AdminInfoService from '@/service/adminInfoService'
import GalgameService from '@/service/galgameService'

class GalgameController {
  async getGalgame(ctx: Context) {
    const gid = ctx.query.gid as string
    if (!gid) {
      ctx.app.emit('kunError', 10601, ctx)
      return
    }

    ctx.body = await GalgameService.gatGalgame(parseInt(gid))
  }

  async deleteGalgameResource(ctx: Context) {
    const grid = ctx.query.grid as string

    const resource = await GalgameService.deleteGalgameResource(parseInt(grid))
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a galgame resource\nOriginal resource: ${JSON.stringify(resource)}`
    )
  }

  async deleteGalgameComment(ctx: Context) {
    const gcid = ctx.query.gcid as string

    const comment = await GalgameService.deleteGalgameComment(parseInt(gcid))
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a galgame comment\nOriginal comment: ${JSON.stringify(comment)}`
    )
  }
}

export default new GalgameController()
