import CommentModel from '@/models/comment'
import ReplyModel from '@/models/reply'
import TopicModel from '@/models/topic'
import UserModel from '@/models/user'

class CommentService {
  async getCommentCidByContent(content: string) {
    const regex = new RegExp(content, 'i')

    const comment = await CommentModel.find({ content: regex })
      .populate('cuid', 'uid avatar name')
      .populate('touid', 'uid avatar name')
      .lean()

    const replyComments = comment.map((comment) => ({
      cid: comment.cid,
      rid: comment.rid,
      tid: comment.tid,
      c_user: {
        uid: comment.cuid[0].uid,
        avatar: comment.cuid[0].avatar,
        name: comment.cuid[0].name,
      },
      to_user: {
        uid: comment.touid[0].uid,
        avatar: comment.touid[0].avatar,
        name: comment.touid[0].name,
      },
      content: comment.content,
      likes: comment.likes,
      dislikes: comment.dislikes,
    }))

    return replyComments
  }

  async updateCommentsByCid(cid: number, content: string) {
    await CommentModel.updateOne({ cid }, { content })
  }

  async deleteCommentsByCid(cid: number) {
    const commentInfo = await CommentModel.findOne({ cid }).lean()

    await UserModel.updateOne(
      {
        uid: commentInfo.c_uid,
      },
      {
        $pull: { comment: commentInfo.cid },
        $inc: {
          comment_count: -1,
          moemoepoint: -commentInfo.likes.length,
          like: -commentInfo.likes.length,
          dislike: -commentInfo.dislikes.length,
        },
      }
    )

    await UserModel.updateOne(
      {
        uid: commentInfo.to_uid,
      },
      { $inc: { moemoepoint: -1, like: -1 } }
    )

    await TopicModel.updateOne(
      { tid: commentInfo.tid },
      { $inc: { popularity: -2, comments: -1 } }
    )

    await ReplyModel.updateOne(
      { rid: commentInfo.rid },
      { $pull: { comment: commentInfo.cid }, $inc: { comment_count: -1 } }
    )

    await CommentModel.deleteOne({ cid })
  }
}

export default new CommentService()
