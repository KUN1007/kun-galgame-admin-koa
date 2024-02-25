import { Context } from 'koa'
import CommentService from '@/service/commentService'

class CommentController {
  async getComments(ctx: Context) {
    const content = ctx.query.content as string
    const comments = await CommentService.getComments(content)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: comments,
    }
  }

  async updateCommentsByCid(ctx: Context) {
    const { cid, content } = ctx.request.body
    await CommentService.updateCommentsByCid(cid, content)
    ctx.body = {
      code: 200,
      message: 'OK',
    }
  }

  async deleteCommentsByCid(ctx: Context) {
    const cid = ctx.query.cid as string
    await CommentService.deleteCommentsByCid(parseInt(cid))
    ctx.body = {
      code: 200,
      message: 'OK',
    }
  }
}

export default new CommentController()
