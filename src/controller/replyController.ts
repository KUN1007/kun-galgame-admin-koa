import { Context } from 'koa'
import ReplyService from '@/service/replyService'
import { getCookieTokenInfo } from '@/utils/cookies'

import { checkReplyPublish } from './utils/checkReplyPublish'
import type { sortField, sortOrder } from './types/replyController'

class ReplyController {
  async updateReply(ctx: Context) {
    const uid = getCookieTokenInfo(ctx).uid
    const tid = parseInt(ctx.params.tid as string)

    const { rid, content, tags, edited } = ctx.request.body

    const result = checkReplyPublish(tags, content, edited)

    if (result) {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    await ReplyService.updateReply(uid, tid, rid, content, tags, edited)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  async getReplies(ctx: Context) {
    try {
      const tid = parseInt(ctx.params.tid as string)

      const pageNumber = parseInt(ctx.query.page as string)
      const limitNumber = parseInt(ctx.query.limit as string)
      const { sortField, sortOrder } = ctx.query

      const data = await ReplyService.getReplies(
        tid,
        pageNumber,
        limitNumber,
        sortField as sortField,
        sortOrder as sortOrder
      )

      ctx.body = {
        code: 200,
        message: 'OK',
        data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch replies' }
    }
  }
}

export default new ReplyController()
