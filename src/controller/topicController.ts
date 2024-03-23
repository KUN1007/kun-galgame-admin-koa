import { type Context } from 'koa'
import TopicService from '@/service/topicService'
import AdminInfoService from '@/service/adminInfoService'
import { getCookieTokenInfo } from '@/utils/cookies'
import { checkTopicPublish } from './utils/checkTopicPublish'

class TopicController {
  async updateTopicByTid(ctx: Context) {
    const { tid, title, content, tags, category, section } = ctx.request.body

    const res = checkTopicPublish(title, content, tags, category, section)
    if (res) {
      ctx.app.emit('kunError', res, ctx)
      return
    }

    const topic = await TopicService.getTopicByTid(tid)
    const topicString = JSON.stringify(topic)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} updated a topic\ntid: ${topic?.tid}\nOriginal topic:\n${topicString}`
    )

    await TopicService.updateTopicByTid(
      tid,
      title,
      content,
      tags,
      category,
      section
    )
  }

  async getTopicsByContentApi(ctx: Context) {
    const keywords = ctx.query.keywords as string
    const roles = getCookieTokenInfo(ctx)?.roles
    if (!roles) {
      return
    }

    if (!keywords.trim() && roles < 3) {
      ctx.app.emit('kunError', 10601, ctx)
      return
    }

    ctx.body = await TopicService.getTopicsByContentApi(
      keywords.trim().slice(0, 40)
    )
  }

  async deleteTopicByTid(ctx: Context) {
    const roles = getCookieTokenInfo(ctx)?.roles
    if (!roles || roles <= 2) {
      ctx.app.emit('kunError', 10107, ctx)
      return
    }

    const tid = ctx.query.tid as string

    const topic = await TopicService.getTopicByTid(parseInt(tid))
    const topicString = JSON.stringify(topic)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a topic\n${topicString}`
    )

    await TopicService.deleteTopicByTid(parseInt(tid))
  }

  async updateTopicStatus(ctx: Context) {
    const { tid, status } = ctx.request.body

    const topic = await TopicService.getTopicByTid(tid)
    const user = ctx.state.user
    if (status) {
      await AdminInfoService.createAdminInfo(
        user.uid,
        'update',
        `${user.name} banned a topic\ntid: ${topic?.tid}\nTitle: ${topic?.title}\n`
      )
    } else {
      await AdminInfoService.createAdminInfo(
        user.uid,
        'update',
        `${user.name} unbanned a topic\ntid: ${topic?.tid}\nTitle: ${topic?.title}\n`
      )
    }

    await TopicService.updateTopicStatus(parseInt(tid), parseInt(status))
  }

  async getNewTopicToday(ctx: Context) {
    ctx.body = await TopicService.getNewTopicToday()
  }
}

export default new TopicController()
