import ReplyModel from '@/models/reply'
import TopicModel from '@/models/topic'
import TagService from './tagService'
import mongoose from '@/db/connection'

import type { sortField, sortOrder } from './types/replyService'

class ReplyService {
  async updateReply(
    uid: number,
    tid: number,
    rid: number,
    content: string,
    tags: string[],
    edited: number
  ) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await ReplyModel.updateOne(
        { rid: rid, r_uid: uid },
        { tags, edited, content }
      )

      await TagService.updateTagsByTidAndRid(tid, rid, tags, [])

      await session.commitTransaction()
      session.endSession()
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  async getReplies(
    tid: number,
    page: number,
    limit: number,
    sortField: sortField,
    sortOrder: sortOrder
  ) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const replyId = (await TopicModel.findOne({ tid }).lean()).replies

      const skip = (page - 1) * limit

      const sortOptions: Record<string, 'asc' | 'desc'> = {
        [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
      }

      const replyDetails = await ReplyModel.find({ rid: { $in: replyId } })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('r_user', 'uid avatar name moemoepoint')
        .populate('to_user', 'uid name')
        .lean()

      const responseData = replyDetails.map((reply) => ({
        rid: reply.rid,
        tid: reply.tid,
        floor: reply.floor,
        to_floor: reply.to_floor,
        r_user: {
          uid: reply.r_user[0].uid,
          name: reply.r_user[0].name,
          avatar: reply.r_user[0].avatar,
          moemoepoint: reply.r_user[0].moemoepoint,
        },
        to_user: {
          uid: reply.to_user[0].uid,
          name: reply.to_user[0].name,
        },
        edited: reply.edited,
        content: reply.content,
        upvotes: reply.upvotes,
        upvote_time: reply.upvote_time,
        likes: reply.likes,
        dislikes: reply.dislikes,
        tags: reply.tags,
        time: reply.time,
        comment: reply.comment,
      }))

      await session.commitTransaction()
      session.endSession()

      return responseData
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }
}

export default new ReplyService()
