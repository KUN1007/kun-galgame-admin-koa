import ReplyModel from '@/models/reply'
import TagService from './tagService'
import mongoose from '@/db/connection'
import UserModel from '@/models/user'
import TopicModel from '@/models/topic'
import commentService from './commentService'

class ReplyService {
  async updateReply(tid: number, rid: number, content: string, tags: string[]) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await ReplyModel.updateOne({ rid: rid }, { tags, content })

      await TagService.updateTagsByTidAndRid(tid, rid, tags, [])

      await session.commitTransaction()
      session.endSession()
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  async getReplies(content: string) {
    const regex = new RegExp(content, 'i')

    const replies = await ReplyModel.find({ content: regex })
      .populate('r_user', 'uid avatar name')
      .populate('to_user', 'uid avatar name')
      .lean()

    const responseData = replies.map((reply) => ({
      rid: reply.rid,
      tid: reply.tid,
      floor: reply.floor,
      to_floor: reply.to_floor,
      r_user: {
        uid: reply.r_user[0].uid,
        name: reply.r_user[0].name,
        avatar: reply.r_user[0].avatar,
      },
      to_user: {
        uid: reply.to_user[0].uid,
        name: reply.to_user[0].name,
        avatar: reply.to_user[0].avatar,
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

    return responseData
  }

  async deleteReplyByRid(rid: number) {
    const replyInfo = await ReplyModel.findOne({ rid })

    const decreaseAmount = replyInfo.likes.length + replyInfo.upvotes.length
    await UserModel.updateOne(
      { uid: replyInfo.r_uid },
      {
        $pull: { reply: replyInfo.rid },
        $inc: {
          reply_count: -1,
          moemoepoint: -decreaseAmount,
          upvote: -replyInfo.upvotes.length,
          like: -replyInfo.likes.length,
          dislike: -replyInfo.dislikes.length,
        },
      }
    )

    await UserModel.updateOne(
      { uid: replyInfo.to_uid },
      {
        $inc: { moemoepoint: -2 },
      }
    )

    await TagService.deleteTagsByTidAndRid(replyInfo.tid, replyInfo.rid)

    await TopicModel.updateOne(
      { tid: replyInfo.tid },
      {
        $inc: { replies_count: -1, popularity: -5 },
        $pull: { replies: replyInfo.rid },
      }
    )

    for (const cid of replyInfo.comment) {
      await commentService.deleteCommentsByCid(cid)
    }

    await ReplyModel.deleteOne({ rid })
  }

  async getNewReplyToday() {
    const replies = await ReplyModel.find({}, 'tid rid content time')
      .populate('r_user', 'uid avatar name')
      .sort({ time: -1 })
      .limit(7)
      .lean()

    const data = replies.map((reply) => ({
      tid: reply.tid,
      rid: reply.rid,
      r_user: {
        uid: reply.r_user[0].uid,
        name: reply.r_user[0].name,
        avatar: reply.r_user[0].avatar,
      },
      content: reply.content.slice(0, 233),
      time: reply.time,
    }))

    return data
  }
}

export default new ReplyService()
