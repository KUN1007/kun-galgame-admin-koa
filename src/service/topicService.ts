import TopicModel from '@/models/topic'
import TagService from './tagService'
import UserService from './userService'
import mongoose from '@/db/connection'

import UserModel from '@/models/user'
import ReplyService from './replyService'

class TopicService {
  async updateTopicByTid(
    tid: number,
    title: string,
    content: string,
    tags: string[],
    category: string[],
    section: string[]
  ) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await TopicModel.updateOne(
        { tid },
        { title, content, tags, category, section }
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
        section: topic.section,
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

  async getTopicsByContentApi(keywords: string) {
    const keywordsArray: string[] = keywords
      .split(' ')
      .filter((keyword) => keyword.trim() !== '')

    const escapedKeywords = keywordsArray.map((keyword) =>
      keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )

    const searchQuery = {
      $or: [
        { title: { $regex: escapedKeywords.join('|'), $options: 'i' } },
        { content: { $regex: escapedKeywords.join('|'), $options: 'i' } },
        { category: { $in: escapedKeywords } },
        { tags: { $in: escapedKeywords } },
      ],
    }

    const topics = await TopicModel.find(searchQuery)
      .populate('user', 'uid avatar name')
      .lean()

    const data = topics.map((topic) => ({
      tid: topic.tid,
      user: {
        uid: topic.user[0].uid,
        avatar: topic.user[0].avatar,
        name: topic.user[0].name,
      },
      title: topic.title,
      category: topic.category,
      section: topic.section,
      tags: topic.tags,
      content: topic.content,
      time: topic.time,
      views: topic.views,
      comments: topic.comments,
      replies: topic.replies_count,

      edited: topic.edited,
      status: topic.status,
    }))

    return data
  }

  async deleteTopicByTid(tid: number) {
    const topic = await TopicModel.findOne({ tid }).lean()

    const decreaseAmount = topic.likes.length + topic.upvotes.length * 7
    await UserModel.updateOne(
      { uid: topic.uid },
      {
        $pull: { topic: topic.tid },
        $inc: {
          daily_topic_count: -1,
          topic_count: -1,
          moemoepoint: -decreaseAmount,
          upvote: -topic.upvotes.length,
          like: -topic.likes.length,
          dislike: -topic.dislikes.length,
        },
      }
    )

    await TagService.deleteTagsByTidAndRid(topic.tid, 0)

    for (const uid of topic.upvotes) {
      await UserModel.updateOne(
        { uid },
        { $inc: { upvote_topic_count: 1 }, $pull: { upvote_topic: tid } }
      )
    }

    for (const uid of topic.likes) {
      await UserModel.updateOne({ uid }, { $pull: { like_topic: tid } })
    }

    for (const uid of topic.dislikes) {
      await UserModel.updateOne({ uid }, { $pull: { dislike_topic: tid } })
    }

    for (const rid of topic.replies) {
      await ReplyService.deleteReplyByRid(rid)
    }

    await TopicModel.deleteOne({ tid })
  }

  async updateTopicStatus(tid: number, status: number) {
    await TopicModel.updateOne({ tid }, { status })
  }

  async getNewTopicToday() {
    const topics = await TopicModel.find({}, 'tid title time popularity')
      .populate('user', 'uid avatar name')
      .sort({ time: -1 })
      .limit(7)
      .lean()

    const data = topics.map((topic) => ({
      tid: topic.tid,
      user: {
        uid: topic.user[0].uid,
        avatar: topic.user[0].avatar,
        name: topic.user[0].name,
      },
      title: topic.title,
      time: topic.time,
    }))

    return data
  }
}

export default new TopicService()
