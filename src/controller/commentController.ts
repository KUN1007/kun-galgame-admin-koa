import { Context } from 'koa'
import AdminInfoService from '@/service/adminInfoService'
import CommentService from '@/service/commentService'

class CommentController {
  async getComments(ctx: Context) {
    const content = ctx.query.content as string
    ctx.body = await CommentService.getComments(content)
  }

  async updateCommentsByCid(ctx: Context) {
    const { cid, content } = ctx.request.body
    const comment = await CommentService.getCommentByCid(cid)

    await CommentService.updateCommentsByCid(cid, content)

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      `${user.name} updated a comment\ncid: ${cid}\ntid: ${comment.tid}\nOriginal comment: ${comment.content}`
    )
  }

  async deleteCommentsByCid(ctx: Context) {
    const cid = ctx.query.cid as string
    const comment = await CommentService.getCommentByCid(parseInt(cid))

    await CommentService.deleteCommentsByCid(parseInt(cid))

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      `${user.name} deleted a comment\ncid: ${cid}\ntid: ${comment.tid}\nOriginal comment: ${comment.content}`
    )
  }

  async getNewCommentToday(ctx: Context) {
    ctx.body = await CommentService.getNewCommentToday()
  }
}

export default new CommentController()
