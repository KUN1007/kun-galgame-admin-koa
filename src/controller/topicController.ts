import { Context } from 'koa'
import TopicService from '@/service/topicService'
import { getCookieTokenInfo } from '@/utils/cookies'
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
  }

  async getTopicsByContentApi(ctx: Context) {
    const keywords = ctx.query.keywords
    ctx.body = await TopicService.getTopicsByContentApi(
      (keywords as string).trim().slice(0, 40)
    )
  }

  async deleteTopicByTid(ctx: Context) {
    const roles = getCookieTokenInfo(ctx).roles
    if (roles <= 2) {
      ctx.app.emit('kunError', 10107, ctx)
      return
    }

    const tid = ctx.query.tid as string
    await TopicService.deleteTopicByTid(parseInt(tid))
  }

  async updateTopicStatus(ctx: Context) {
    const { tid, status } = ctx.request.body
    await TopicService.updateTopicStatus(parseInt(tid), parseInt(status))
  }

  async getTopicRanking(ctx: Context) {
    const { page, limit, sortField, sortOrder } = ctx.query

    ctx.body = await TopicService.getTopicRanking(
      parseInt(page as string),
      parseInt(limit as string),
      sortField as SortFieldRanking,
      sortOrder as SortOrder
    )
  }
}

export default new TopicController()
