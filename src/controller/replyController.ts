import { Context } from 'koa'
import ReplyService from '@/service/replyService'

class ReplyController {
  async updateReply(ctx: Context) {
    const { tid, rid, content, tags } = ctx.request.body
    await ReplyService.updateReply(tid, rid, content, tags)
    ctx.body = {
      code: 200,
      message: 'OK',
    }
  }

  async getReplies(ctx: Context) {
    const content = ctx.query.content as string
    const replies = await ReplyService.getReplies(content)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: replies,
    }
  }

  async deleteReplyByRid(ctx: Context) {
    const rid = ctx.query.rid as string
    await ReplyService.deleteReplyByRid(parseInt(rid))
    ctx.body = {
      code: 200,
      message: 'OK',
    }
  }
}

export default new ReplyController()
