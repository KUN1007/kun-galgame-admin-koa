import { Context } from 'koa'
import AdminInfoService from '@/service/adminInfoService'
import CommentService from '@/service/commentService'

class CommentController {
  async getComments(ctx: Context) {
    const content = ctx.query.content as string
    if (!content.trim()) {
      ctx.app.emit('kunError', 10601, ctx)
      return
    }

    ctx.body = await CommentService.getComments(content)
  }

  async updateCommentsByCid(ctx: Context) {
    const { cid, content } = ctx.request.body

    const comment = await CommentService.getCommentByCid(cid)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} updated a comment\ncid: ${cid}\ntid: ${comment.tid}\nOriginal comment: ${comment.content}`
    )

    await CommentService.updateCommentsByCid(cid, content)
  }

  async deleteCommentsByCid(ctx: Context) {
    const cid = ctx.query.cid as string

    const comment = await CommentService.getCommentByCid(parseInt(cid))
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a comment\ncid: ${cid}\ntid: ${comment.tid}\nOriginal comment: ${comment.content}`
    )

    await CommentService.deleteCommentsByCid(parseInt(cid))
  }

  async getNewCommentToday(ctx: Context) {
    ctx.body = await CommentService.getNewCommentToday()
  }
}

export default new CommentController()
