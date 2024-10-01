import MessageAdminModel from '@/models/message-admin'

class MessageAdminService {
  async createMessageAdmin(uid: number, content: KunLanguage) {
    await MessageAdminModel.create({
      uid,
      time: Date.now(),
      content
    })
  }

  async getMessageAdmins(page: number, limit: number) {
    const skip = (page - 1) * limit

    const messageAdmin = await MessageAdminModel.find()
      .sort({ maid: -1 })
      .skip(skip)
      .limit(limit)

    const data = messageAdmin.map((message) => ({
      maid: message.maid,
      time: message.time,
      status: message.status,
      content: message.content
    }))

    return data
  }

  async deleteMessageAdmin(maid: number) {
    const messageAdmin = await MessageAdminModel.findOneAndDelete({ maid })
    return messageAdmin
  }
}

export default new MessageAdminService()
