import { Context } from 'koa'
import TopicService from '@/service/topicService'

import { checkTopicPublish } from './utils/checkTopicPublish'
import type { SortOrder, SortFieldRanking } from './types/topicController'

class TopicController {
  async updateTopic(ctx: Context) {
    const { tid, title, content, tags, category } = ctx.request.body

    const res = checkTopicPublish(title, content, tags, category)

    if (res) {
      ctx.app.emit('kunError', res, ctx)
      return
    }

    await TopicService.updateTopic(tid, title, content, tags, category)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  async getTopicsByContentApi(ctx: Context) {
    const keywords = ctx.query.keywords
    const data = await TopicService.getTopicsByContentApi(
      (keywords as string).trim().slice(0, 40)
    )
    ctx.body = { code: 200, message: 'OK', data: data }
  }

  async getTopicRanking(ctx: Context) {
    const { page, limit, sortField, sortOrder } = ctx.query

    const topics = await TopicService.getTopicRanking(
      parseInt(page as string),
      parseInt(limit as string),
      sortField as SortFieldRanking,
      sortOrder as SortOrder
    )
    ctx.body = { code: 200, message: 'OK', data: topics }
  }
}

export default new TopicController()
