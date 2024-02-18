/*
 * 话题的 CRUD，定义了一些对话题数据的数据库交互操作
 */

import TopicModel from '@/models/topic'
import TagService from './tagService'
import UserService from './userService'
import mongoose from '@/db/connection'

import type {
  SortField,
  SortOrder,
  SortFieldRanking,
} from './types/topicService'

class TopicService {
  async updateTopic(
    uid: number,
    tid: number,
    title: string,
    content: string,
    tags: string[],
    category: string[],
    edited: number
  ) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await TopicModel.updateOne(
        { tid, uid },
        { title, content, tags, category, edited }
      )

      await TagService.updateTagsByTidAndRid(tid, 0, tags, category)

      await session.commitTransaction()
      session.endSession()
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  async getTopicByTid(tid: number) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const topic = await TopicModel.findOne({ tid }).lean()

      await TopicModel.updateOne(
        { tid },
        { $inc: { views: 1, popularity: 0.1 } }
      )

      const userInfo = await UserService.getUserInfoByUid(topic.uid, [
        'uid',
        'avatar',
        'name',
        'moemoepoint',
      ])

      const data = {
        tid: topic.tid,
        title: topic.title,
        views: topic.views,
        likes: topic.likes,
        dislikes: topic.dislikes,
        time: topic.time,
        content: topic.content,
        upvotes: topic.upvotes,
        tags: topic.tags,
        edited: topic.edited,
        user: {
          uid: userInfo.uid,
          name: userInfo.name,
          avatar: userInfo.avatar,
          moemoepoint: userInfo.moemoepoint,
        },
        replies: topic.replies,
        status: topic.status,
        share: topic.share,
        category: topic.category,
        popularity: topic.popularity,
        upvote_time: topic.upvote_time,
      }

      await session.commitTransaction()
      session.endSession()

      return data
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  async searchTopics(
    keywords: string,
    category: string[],
    page: number,
    limit: number,
    sortField: SortField,
    sortOrder: SortOrder
  ) {
    const skip = (page - 1) * limit

    const keywordsArray: string[] = keywords
      .split(' ')
      .filter((keyword) => keyword.trim() !== '')

    const escapedKeywords = keywordsArray.map((keyword) =>
      keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )

    const searchQuery = {
      $and: [
        { category: { $in: category } },
        {
          $or: [
            { title: { $regex: escapedKeywords.join('|'), $options: 'i' } },
            { content: { $regex: escapedKeywords.join('|'), $options: 'i' } },
            { category: { $in: escapedKeywords } },
            { tags: { $in: escapedKeywords } },
          ],
        },
      ],
    }

    const sortOptions: Record<string, 'asc' | 'desc'> = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
    }

    const topics = await TopicModel.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const data = topics.map((topic) => ({
      tid: topic.tid,
      title: topic.title,
      category: topic.category,
      content: topic.content.slice(0, 107),
    }))

    return data
  }

  async getTopicRanking(
    page: number,
    limit: number,
    sortField: SortFieldRanking,
    sortOrder: SortOrder
  ) {
    const skip = (page - 1) * limit

    const sortOptions: Record<string, 'asc' | 'desc'> = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
    }

    const topics = await TopicModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = topics.map((topic) => ({
      tid: topic.tid,
      title: topic.title,
      field: topic[sortField],
    }))

    return responseData
  }
}

export default new TopicService()
