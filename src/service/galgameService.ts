import UserModel from '@/models/user'
import MessageModel from '@/models/message'
import GalgameModel from '@/models/galgame'
import GalgameResourceModel from '@/models/galgameResource'
import GalgameCommentModel from '@/models/galgameComment'
import GalgamePRModel from '@/models/galgamePr'
import GalgameLinkModel from '@/models/galgameLink'
import GalgameHistoryModel from '@/models/galgameHistory'

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
  }

  async deleteGalgameComment(gcid: number) {
    const comment = await GalgameCommentModel.findOne({ gcid }).lean()
    if (!comment) {
      return
    }

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
  }

  async deleteGalgame(gid: number) {
    const galgame = await GalgameModel.findOne({ gid })
    if (!galgame) {
      return
    }

    for (const contributor of galgame.contributor) {
      await UserModel.updateOne(
        { uid: contributor },
        { $pull: { contribute_galgame: gid } }
      )
    }

    for (const likedUser of galgame.likes) {
      await UserModel.updateOne(
        { uid: likedUser },
        { $pull: { like_galgame: gid } }
      )
    }

    for (const favoriteUser of galgame.favorites) {
      await UserModel.updateOne(
        { uid: favoriteUser },
        { $pull: { favorite_galgame: gid } }
      )
    }

    for (const ser of galgame.series) {
      await GalgameModel.updateOne({ gid: ser }, { $pull: { series: gid } })
    }

    for (const res of galgame.resources) {
      await this.deleteGalgameResource(res)
    }

    for (const com of galgame.comments) {
      await this.deleteGalgameComment(com)
    }

    await GalgameLinkModel.deleteMany({ gid })
    await GalgameLinkModel.deleteMany({ gid })
    await GalgameHistoryModel.deleteMany({ gid })
    await GalgamePRModel.deleteMany({ gid })
    await MessageModel.deleteMany({ gid })
  }
}

export default new GalgameService()
