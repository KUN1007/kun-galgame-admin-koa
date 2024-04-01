import { type Context } from 'koa'
import NonMoeService from '@/service/nonMoeService'

class NonMoeController {
  async createNonMoeLog(ctx: Context) {
    const { uid, name, description_en_us, description_zh_cn, time, result } =
      ctx.request.body

    await NonMoeService.createNonMoeLog(
      uid,
      name,
      description_en_us,
      description_zh_cn,
      time,
      result
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

    console.log(nid, result)

    await NonMoeService.updateNonMoeLog(parseInt(nid), result)
  }

  async withdrawNonMoeLog(ctx: Context) {
    const { nid } = ctx.params

    await NonMoeService.withdrawNonMoeLog(parseInt(nid))
  }
}

export default new NonMoeController()
