import { Context } from 'koa'
import TagService from '@/service/tagService'

class TagController {
  async getTopTags(ctx: Context) {
    const limit = parseInt(ctx.query.limit as string)

    try {
      const topTags = await TagService.getTopTags(limit)
      ctx.body = {
        code: 200,
        message: 'OK',
        data: topTags,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { code: 500, message: 'Failed to get top tags' }
    }
  }
}

export default new TagController()
