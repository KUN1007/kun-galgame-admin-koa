import { type Context } from 'koa'
import NonMoeService from '@/service/nonMoeService'

class NonMoeController {
  async createNonMoeLog(ctx: Context) {
    const { uid, name, description, time, result } = ctx.request.body

    await NonMoeService.createNonMoeLog(uid, name, description, time, result)
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
  }

  async withdrawNonMoeLog(ctx: Context) {
    const { nid } = ctx.params

    await NonMoeService.withdrawNonMoeLog(parseInt(nid))
  }
}

export default new NonMoeController()
