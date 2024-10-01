import { type Context } from 'koa'
import messageAdminService from '@/service/messageAdminService'
import AdminInfoService from '@/service/adminInfoService'

class MessageAdminController {
  async createMessageAdmin(ctx: Context) {
    const { content } = ctx.request.body
    const user = ctx.state.user

    await messageAdminService.createMessageAdmin(user.uid, content)

    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} created an admin message to all forum members\nMessage content: ${JSON.stringify(content)}`
    )
  }

  async getMessageAdmins(ctx: Context) {
    const page = ctx.query.page as string
    const limit = ctx.query.limit as string

    ctx.body = await messageAdminService.getMessageAdmins(
      parseInt(page),
      parseInt(limit)
    )
  }

  async deleteMessageAdmin(ctx: Context) {
    const maid = parseInt(ctx.query.maid as string)
    await messageAdminService.deleteMessageAdmin(maid)
  }
}

export default new MessageAdminController()
