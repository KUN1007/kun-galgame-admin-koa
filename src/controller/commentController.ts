import { Context } from 'koa'
import CommentService from '@/service/commentService'

class CommentController {
  async getCommentCidByContent(ctx: Context) {
    const content = ctx.query.content as string
    const comments = await CommentService.getCommentCidByContent(content)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: comments,
    }
  }

  async updateCommentsByReplyRid(ctx: Context) {
    const { rid, content } = ctx.request.body
    await CommentService.updateCommentsByReplyRid(rid, content)
    ctx.body = {
      code: 200,
      message: 'OK',
    }
  }
}

export default new CommentController()
