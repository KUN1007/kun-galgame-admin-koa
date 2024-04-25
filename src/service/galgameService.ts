import mongoose from '@/db/connection'
import UserModel from '@/models/user'
import GalgameModel from '@/models/galgame'
import GalgameResourceModel from '@/models/galgameResource'
import GalgameCommentModel from '@/models/galgameComment'

class GalgameService {
  async getGalgameResources(gid: number) {
    const data = await GalgameResourceModel.find({ gid })
      .populate('user', 'uid avatar name', UserModel)
      .sort({ created: -1 })
      .lean()

    const resources = data.map((galgame) => ({
      gid: galgame.gid,
      grid: galgame.grid,
      link: galgame.link,
      time: galgame.time,
      user: {
        uid: galgame.user[0].uid,
        name: galgame.user[0].name,
        avatar: galgame.user[0].avatar
      }
    }))

    return resources
  }

  async getGalgameComments(gid: number) {
    const data = await GalgameCommentModel.find({ gid })
      .populate('cuid', 'uid avatar name', UserModel)
      .lean()

    const comments = data.map((comment) => ({
      gcid: comment.gcid,
      gid: comment.gid,
      time: comment.created,
      content: comment.content,
      user: {
        uid: comment.cuid[0].uid,
        name: comment.cuid[0].name,
        avatar: comment.cuid[0].avatar
      }
    }))

    return comments
  }

  async gatGalgame(gid: number) {
    const galgame = await GalgameModel.findOne({ gid }).lean()
    if (!galgame) {
      return
    }

    const resources = await this.getGalgameResources(gid)
    const comments = await this.getGalgameComments(gid)

    const responseData = {
      gid,
      name: galgame.name,
      resources,
      comments
    }

    return responseData
  }

  async deleteGalgameResource(grid: number) {
    const resource = await GalgameResourceModel.findOne({ grid }).lean()
    if (!resource) {
      return
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await UserModel.updateOne(
        { uid: resource.uid },
        {
          $inc: {
            moemoepoint: -(resource.likes.length + 5),
            like: -resource.likes.length
          }
        }
      )

      for (const likedUser of resource.likes) {
        await UserModel.updateOne(
          { uid: likedUser },
          { $pull: { like_galgame_resource: grid } }
        )
      }

      await GalgameModel.updateOne(
        { gid: resource.gid },
        { $pull: { resources: resource.grid } }
      )

      await GalgameResourceModel.deleteOne({ grid })

      return resource
    } catch (error) {
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
  }

  async deleteGalgameComment(gcid: number) {
    const comment = await GalgameCommentModel.findOne({ gcid }).lean()
    if (!comment) {
      return
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      if (comment.to_uid && comment.c_uid !== comment.to_uid) {
        await UserModel.updateOne(
          { uid: comment.to_uid },
          { $inc: { moemoepoint: -1 } }
        )
      }

      await UserModel.updateOne(
        { uid: comment.c_uid },
        {
          $inc: {
            moemoepoint: -comment.likes.length,
            like: -comment.likes.length
          }
        }
      )

      await GalgameCommentModel.deleteOne({ gcid })

      return comment
    } catch (error) {
      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
  }
}

export default new GalgameService()
