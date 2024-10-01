import UserModel from '@/models/user'
import TopicModel from '@/models/topic'
import ReplyModel from '@/models/reply'
import CommentModel from '@/models/comment'
import mongoose from '@/db/connection'

type ModelName = 'topic' | 'reply' | 'comment' | 'user'

class OverviewService {
  async getCountData(models: any[]) {
    const counts = await Promise.all(
      models.map((model) => model.countDocuments())
    )
    return counts
  }

  async getSumData() {
    const [topicCount, replyCount, commentCount, userCount] =
      await this.getCountData([TopicModel, ReplyModel, CommentModel, UserModel])
    return { topicCount, replyCount, commentCount, userCount }
  }

  async getOverviewData(days: number) {
    const time = new Date()
    time.setDate(time.getDate() - days)

    const conditions = { created: { $gte: time } }

    const [newTopics, newReplies, newComments, newUsers] = await Promise.all([
      TopicModel.countDocuments(conditions),
      ReplyModel.countDocuments(conditions),
      CommentModel.countDocuments(conditions),
      UserModel.countDocuments(conditions)
    ])

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
