import UserModel from '@/models/user'
import TopicModel from '@/models/topic'
import ReplyModel from '@/models/reply'
import CommentModel from '@/models/comment'
import mongoose from '@/db/connection'

type ModelName = 'topic' | 'reply' | 'comment' | 'user'

class OverviewService {
  async getSumData() {
    const topicCount = await TopicModel.countDocuments().lean()
    const replyCount = await ReplyModel.countDocuments().lean()
    const commentCount = await CommentModel.countDocuments().lean()
    const userCount = await UserModel.countDocuments().lean()
    return { topicCount, replyCount, commentCount, userCount }
  }

  async getOverviewData(days: number) {
    const time = new Date()
    time.setDate(time.getDate() - days)

    const newTopics = await TopicModel.countDocuments({
      created: { $gte: time }
    }).lean()
    const newReplies = await ReplyModel.countDocuments({
      created: { $gte: time }
    }).lean()
    const newComments = await CommentModel.countDocuments({
      created: { $gte: time }
    }).lean()
    const newUsers = await UserModel.countDocuments({
      created: { $gte: time }
    }).lean()

    return { newTopics, newReplies, newComments, newUsers }
  }

  async getLineChartData(days: number, model: ModelName) {
    const mongooseModel = mongoose.model(model)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daysAgo = new Date(today)
    daysAgo.setDate(today.getDate() - (days - 1))

    const result = await mongooseModel
      .aggregate([
        {
          $match: {
            created: { $gte: daysAgo, $lte: today }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$created' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
      .exec()

    const filledResults: number[] = []
    for (let i = days - 1; i >= 0; i--) {
      const targetDate = new Date(daysAgo)
      targetDate.setDate(daysAgo.getDate() + i)

      const dateString = targetDate.toISOString().split('T')[0]
      const found = result.find((r) => r._id === dateString)

      filledResults.push(found ? found.count : 0)
    }

    return filledResults
  }
}

export default new OverviewService()
