import CommentModel from '@/models/comment'

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

  async updateCommentsByReplyRid(rid: number, content: string) {
    await CommentModel.updateOne({ rid }, { content })
  }
}

export default new CommentService()
