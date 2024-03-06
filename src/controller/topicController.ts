import { Context } from 'koa'
import TopicService from '@/service/topicService'

import { checkTopicPublish } from './utils/checkTopicPublish'

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
    const tid = ctx.query.tid as string
    await TopicService.deleteTopicByTid(parseInt(tid))
  }

  async updateTopicStatus(ctx: Context) {
    const { tid, status } = ctx.request.body
    await TopicService.updateTopicStatus(parseInt(tid), parseInt(status))
  }

  async getNewTopicToday(ctx: Context) {
    ctx.body = await TopicService.getNewTopicToday()
  }
}

export default new TopicController()
