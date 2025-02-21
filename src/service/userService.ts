import bcrypt from 'bcrypt'
import UserModel from '@/models/user'
import TopicModel from '@/models/topic'
import MessageModel from '@/models/message'
import GalgameModel from '@/models/galgame'
import GalgameCommentModel from '@/models/galgameComment'
import TopicService from './topicService'
import ReplyService from './replyService'
import GalgameService from './galgameService'
import CommentService from './commentService'
import ReplyModel from '@/models/reply'
import CommentModel from '@/models/comment'
import { generateLoginToken } from '@/utils/jwt'
import { setValue } from '@/config/redisConfig'
import {
  ADMIN_DELETE_EMAIL_CACHE_KEY,
  ADMIN_DELETE_IP_CACHE_KEY
} from '@/config/admin'
import type { LoginResponseData } from './types/userService'
import GalgameResourceModel from '@/models/galgameResource'

class UserService {
  async getUserByUid(uid: number, roles: number) {
    const user = await UserModel.findOne({ uid }).lean()

    if (!user) {
      return null
    }

    const { email, ip, ...rest } = user
    const modifiedRest = roles > 2 ? { email, ip, ...rest } : rest

    return modifiedRest
  }

  async getUserByUsername(name: string) {
    const regex = new RegExp(name, 'i')
    const users = await UserModel.find({ name: regex }).lean()
    const responseData = users.map((user) => ({
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      time: user.time,
      status: user.status
    }))
    return responseData
  }

  async getUserByUsernameExactly(name: string) {
    const user = await UserModel.findOne({ name }).lean()
    if (!user) {
      return null
    }
    const responseData = {
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      time: user.time,
      status: user.status
    }
    return responseData
  }

  async getUserInfoByUid(uid: number, fieldsToSelect: string[]) {
    const userProjection = fieldsToSelect.join(' ')
    const user = await UserModel.findOne({ uid }).select(userProjection).lean()
    return user
  }

  async loginUser(
    name: string,
    password: string
  ): Promise<number | LoginResponseData> {
    const user = await UserModel.findOne({ $or: [{ name }, { email: name }] })

    if (!user) {
      return 10101
    }

    if (user.roles <= 1) {
      return 10106
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (isCorrectPassword) {
      const token = await generateLoginToken(user.uid, user.name, user.roles)

      const userInfo = {
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        roles: user.roles,
        token
      }

      return userInfo
    } else {
      return 10102
    }
  }

  async updateUserByUid(
    uid: string,
    fieldToUpdate: string,
    newFieldValue: string | number
  ) {
    await UserModel.updateOne(
      { uid },
      { $set: { [fieldToUpdate]: newFieldValue } }
    )
  }

  async deleteUserByUid(uid: number) {
    const user = await UserModel.findOne({ uid }).lean()
    if (!user) {
      return
    }

    for (const tid of user.topic) {
      await TopicService.deleteTopicByTid(tid)
    }

    for (const rid of user.reply) {
      await ReplyService.deleteReplyByRid(rid)
    }

    for (const cid of user.comment) {
      await CommentService.deleteCommentsByCid(cid)
    }

    for (const gid of user.galgame) {
      await GalgameService.deleteGalgame(gid)
    }

    for (const likeTopic of user.like_topic) {
      await TopicModel.updateOne({ tid: likeTopic }, { $pull: { likes: uid } })
    }

    for (const dislikeTopic of user.dislike_topic) {
      await TopicModel.updateOne(
        { tid: dislikeTopic },
        { $pull: { dislikes: uid } }
      )
    }

    for (const upvoteTopic of user.upvote_topic) {
      await TopicModel.updateOne(
        { tid: upvoteTopic },
        { $pull: { upvotes: uid } }
      )
    }

    for (const favoriteTopic of user.favorite_topic) {
      await TopicModel.updateOne(
        { tid: favoriteTopic },
        { $pull: { favorites: uid } }
      )
    }

    for (const likeGalgame of user.like_galgame) {
      await GalgameModel.updateOne(
        { gid: likeGalgame },
        { $pull: { likes: uid } }
      )
    }

    for (const favoriteGalgame of user.favorite_galgame) {
      await GalgameModel.updateOne(
        { gid: favoriteGalgame },
        { $pull: { favorites: uid } }
      )
    }

    for (const contributeGalgame of user.contribute_galgame) {
      await GalgameModel.updateOne(
        { gid: contributeGalgame },
        { $pull: { contributor: uid } }
      )
    }

    for (const likeResource of user.like_galgame_resource) {
      await GalgameResourceModel.updateOne(
        { grid: likeResource },
        { $pull: { likes: uid } }
      )
    }

    await GalgameCommentModel.deleteMany({ c_uid: uid })
    await GalgameCommentModel.updateMany({ to_uid: uid }, { to_uid: 0 })

    await MessageModel.deleteMany({ sender_uid: uid })
    await MessageModel.deleteMany({ receiver_uid: uid })

    await setValue(
      `${ADMIN_DELETE_EMAIL_CACHE_KEY}:${user.email}`,
      user.email,
      10 * 365 * 24 * 60 * 60
    )
    await setValue(
      `${ADMIN_DELETE_IP_CACHE_KEY}:${user.ip}`,
      user.ip,
      10 * 365 * 24 * 60 * 60
    )

    await UserModel.deleteOne({ uid })

    return user
  }

  async getUserTopics(tidArray: number[]) {
    const topics = await TopicModel.find({ tid: { $in: tidArray } }).limit(50)

    const responseData = topics.map((topic) => ({
      tid: topic.tid,
      title: topic.title,
      time: topic.time
    }))
    return responseData
  }

  async getUserReplies(ridArray: number[]) {
    const replies = await ReplyModel.find({ rid: { $in: ridArray } }).limit(50)

    const responseData = replies.map((reply) => ({
      tid: reply.tid,
      content: reply.content.substring(0, 100),
      time: reply.time
    }))
    return responseData
  }

  async getUserComments(cidArray: number[]) {
    const comments = await CommentModel.find({ cid: { $in: cidArray } }).limit(
      50
    )

    const responseData = comments.map((comment) => ({
      tid: comment.tid,
      content: comment.content.substring(0, 100)
    }))
    return responseData
  }
}

export default new UserService()
