import { type Context } from 'koa'
import NonMoeService from '@/service/nonMoeService'
import AdminInfoService from '@/service/adminInfoService'

class NonMoeController {
  async createNonMoeLog(ctx: Context) {
    const { uid, name, description, time, result } = ctx.request.body

    await NonMoeService.createNonMoeLog(uid, name, description, time, result)

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} created a non-moe log\nuid: ${uid}\nname: ${name}\ndescription: ${description}\nresult: ${result}`
    )
  }

  async getNonMoeLogsByUid(ctx: Context): Promise<void> {
    const uid = parseInt(ctx.params.uid as string)
    ctx.body = await NonMoeService.getNonMoeLogs(uid)
  }

  async getNonMoeLogs(ctx: Context) {
    ctx.body = await NonMoeService.getNonMoeLogs()
  }

  async updateNonMoeLog(ctx: Context) {
    const { nid } = ctx.params
    const result = ctx.request.body
    await NonMoeService.updateNonMoeLog(parseInt(nid), result)

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} created a non-moe log\nresult: ${result}`
    )
  }

  async withdrawNonMoeLog(ctx: Context) {
    const { nid } = ctx.params

    await NonMoeService.withdrawNonMoeLog(parseInt(nid))

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a non-moe log\nnid: ${nid}`
    )
  }
}

export default new NonMoeController()
