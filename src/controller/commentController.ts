import { Context } from 'koa'
import CommentService from '@/service/commentService'

class CommentController {
  async getComments(ctx: Context) {
    const content = ctx.query.content as string
    ctx.body = await CommentService.getComments(content)
  }

  async updateCommentsByCid(ctx: Context) {
    const { cid, content } = ctx.request.body
    await CommentService.updateCommentsByCid(cid, content)
  }

  async deleteCommentsByCid(ctx: Context) {
    const cid = ctx.query.cid as string
    await CommentService.deleteCommentsByCid(parseInt(cid))
  }

  async getNewCommentToday(ctx: Context) {
    ctx.body = await CommentService.getNewCommentToday()
  }
}

export default new CommentController()
