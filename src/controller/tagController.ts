import { type Context } from 'koa'
import TagService from '@/service/tagService'

class TagController {
  async getTopTags(ctx: Context) {
    const limit = parseInt(ctx.query.limit as string)
    ctx.body = await TagService.getTopTags(limit)
  }
}

export default new TagController()
