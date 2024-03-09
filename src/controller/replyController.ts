import { Context } from 'koa'
import AdminInfoService from '@/service/adminInfoService'
import ReplyService from '@/service/replyService'

class ReplyController {
  async updateReply(ctx: Context) {
    const { tid, rid, content, tags } = ctx.request.body

    const reply = await ReplyService.getReplyByRid(rid)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} updated a reply\nrid: ${rid}\ntid: ${reply.tid}\nOriginal reply: ${reply.content}`
    )

    await ReplyService.updateReply(tid, rid, content, tags)
  }

  async getReplies(ctx: Context) {
    const content = ctx.query.content as string
    ctx.body = await ReplyService.getReplies(content)
  }

  async deleteReplyByRid(ctx: Context) {
    const rid = ctx.query.rid as string

    const reply = await ReplyService.getReplyByRid(parseInt(rid))
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a reply\nrid: ${rid}\ntid: ${reply.tid}\nOriginal reply: ${reply.content}`
    )

    await ReplyService.deleteReplyByRid(parseInt(rid))
  }

  async getNewReplyToday(ctx: Context) {
    ctx.body = await ReplyService.getNewReplyToday()
  }
}

export default new ReplyController()
