import { Context } from 'koa'
import TopicService from '@/service/topicService'
import { getCookieTokenInfo } from '@/utils/cookies'

import { checkTopicPublish } from './utils/checkTopicPublish'
import type {
  SortField,
  SortOrder,
  SortFieldRanking,
} from './types/topicController'

class TopicController {
  async getTopicByTid(ctx: Context) {
    const tid = parseInt(ctx.params.tid as string)
    const topic = await TopicService.getTopicByTid(tid)

    if (!topic) {
      ctx.body = { code: '404', message: 'Topic not found', data: {} }
      return
    }

    ctx.body = {
      code: 200,
      message: 'OK',
      data: topic,
    }
  }

  async updateTopic(ctx: Context) {
    const uid = getCookieTokenInfo(ctx).uid

    const tid = parseInt(ctx.params.tid as string)

    const { title, content, tags, category, edited } = ctx.request.body

    const res = checkTopicPublish(title, content, tags, category, edited)

    if (res) {
      ctx.app.emit('kunError', res, ctx)
      return
    }

    await TopicService.updateTopic(
      uid,
      tid,
      title,
      content,
      tags,
      category,
      edited
    )

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  async searchTopics(ctx: Context) {
    const { keywords, category, page, limit, sortField, sortOrder } = ctx.query
    const data = await TopicService.searchTopics(
      (keywords as string).trim().slice(0, 40),
      JSON.parse(category as string),
      parseInt(page as string),
      parseInt(limit as string),
      sortField as SortField,
      sortOrder as SortOrder
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
