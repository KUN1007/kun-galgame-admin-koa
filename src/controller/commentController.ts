import { Context } from 'koa'
import CommentService from '@/service/commentService'

class CommentController {
  async getCommentsByReplyRid(ctx: Context) {
    try {
      const rid = parseInt(ctx.query.rid as string)
      const comments = await CommentService.getCommentsByReplyRid(rid)
      ctx.body = {
        code: 200,
        message: 'OK',
        data: comments,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch comments' }
    }
  }
}

export default new CommentController()
