import AdminInfoModel from '@/models/adminInfo'

type AdminInfo = 'get' | 'put' | 'update' | 'delete' | 'global'

class AdminInfoService {
  async createAdminInfo(uid: number, type: AdminInfo, content: string) {
    const newAdminInfo = new AdminInfoModel({
      uid,
      type,
      content,
    })

    await newAdminInfo.save()
  }

  async getAdminInfo(page: number, limit: number) {
    const skip = (page - 1) * limit

    const adminInfos = await AdminInfoModel.find()
      .populate('sender', 'uid avatar name')
      .sort({ time: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const data = adminInfos.map((info) => ({
      ai_id: info.ai_id,
      user: {
        uid: info.sender[0].uid,
        avatar: info.sender[0].avatar,
        name: info.sender[0].name,
      },
      type: info.type,
      content: info.content,
      time: info.time,
    }))

    return data
  }
}

export default new AdminInfoService()
