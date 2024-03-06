import { Context } from 'koa'
import ReplyService from '@/service/replyService'

class ReplyController {
  async updateReply(ctx: Context) {
    const { tid, rid, content, tags } = ctx.request.body
    await ReplyService.updateReply(tid, rid, content, tags)
  }

  async getReplies(ctx: Context) {
    const content = ctx.query.content as string
    ctx.body = await ReplyService.getReplies(content)
  }

  async deleteReplyByRid(ctx: Context) {
    const rid = ctx.query.rid as string
    await ReplyService.deleteReplyByRid(parseInt(rid))
  }

  async getNewReplyToday(ctx: Context) {
    ctx.body = await ReplyService.getNewReplyToday()
  }
}

export default new ReplyController()
