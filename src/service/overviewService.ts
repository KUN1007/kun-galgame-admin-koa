import UserModel from '@/models/user'
import TopicModel from '@/models/topic'
import ReplyModel from '@/models/reply'
import CommentModel from '@/models/comment'

type Field = 'topic' | 'reply' | 'comment' | 'user'

class OverviewService {
  async getOverviewData(days: number) {
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - days)

    const newTopics = await TopicModel.countDocuments({
      createdAt: { $gte: oneDayAgo },
    })
    const newReplies = await ReplyModel.countDocuments({
      createdAt: { $gte: oneDayAgo },
    })
    const newComments = await CommentModel.countDocuments({
      createdAt: { $gte: oneDayAgo },
    })
    const newUsers = await UserModel.countDocuments({
      createdAt: { $gte: oneDayAgo },
    })

    return { newTopics, newReplies, newComments, newUsers }
  }

  async getWeekData(days: number, field: Field) {
    const time = new Date()
    time.setDate(time.getDate() - days)

    let Model
    switch (field) {
      case 'topic':
        Model = TopicModel
        break
      case 'reply':
        Model = ReplyModel
        break
      case 'comment':
        Model = CommentModel
        break
      case 'user':
        Model = UserModel
        break
      default:
        return
    }

    const result = await Model.aggregate([
      {
        $match: { createdAt: { $gte: time } },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ])

    const weekData = result.map((entry: any) => ({
      date: new Date(entry._id.year, entry._id.month - 1, entry._id.day),
      count: entry.count,
    }))

    return weekData
  }
}

export default new OverviewService()
