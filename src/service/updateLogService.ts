import UpdateLogModel from '@/models/updateLog'

class UpdateLogService {
  async createUpdateLog(
    type: string,
    content: KunLanguage,
    time: string,
    version: string
  ) {
    const newUpdateLog = new UpdateLogModel({
      type,
      content,
      time,
      version
    })
    await newUpdateLog.save()
  }

  async getUpdateLogs(page: number, limit: number) {
    const skip = (page - 1) * limit

    const updateLogs = await UpdateLogModel.find()
      .sort({ upid: -1 })
      .skip(skip)
      .limit(limit)

    const data = updateLogs.map((log) => ({
      upid: log.upid,
      content: log.content,
      time: log.time,
      version: log.version
    }))

    return data
  }

  async updateUpdateLog(
    upid: number,
    contentEn: string,
    contentZh: string,
    version: string
  ) {
    await UpdateLogModel.updateOne(
      { upid },
      {
        content: {
          'en-us': contentEn,
          'zh-cn': contentZh
        },
        version
      }
    )
  }

  async deleteUpdateLog(upid: number) {
    const deletedUpdateLog = await UpdateLogModel.findOneAndDelete({ upid })
    return deletedUpdateLog
  }
}

export default new UpdateLogService()
