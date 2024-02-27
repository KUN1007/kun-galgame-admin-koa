import { Context } from 'koa'
import TopicService from '@/service/topicService'

import { checkTopicPublish } from './utils/checkTopicPublish'
import type { SortOrder, SortFieldRanking } from './types/topicController'

class TopicController {
  async updateTopicByTid(ctx: Context) {
    const { tid, title, content, tags, category } = ctx.request.body

    const res = checkTopicPublish(title, content, tags, category)

    if (res) {
      ctx.app.emit('kunError', res, ctx)
      return
    }

    await TopicService.updateTopicByTid(tid, title, content, tags, category)

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

  async deleteTopicByTid(ctx: Context) {
    const tid = ctx.query.tid as string
    await TopicService.deleteTopicByTid(parseInt(tid))
    ctx.body = {
      code: 200,
      message: 'OK',
    }
  }

  async updateTopicStatus(ctx: Context) {
    const { tid, status } = ctx.request.body
    await TopicService.updateTopicStatus(parseInt(tid), parseInt(status))
    ctx.body = {
      code: 200,
      message: 'OK',
    }
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
