import UpdateLogModel from '@/models/updateLog'

class UpdateLogService {
  async createUpdateLog (
    type: string,
    contentEn: string,
    contentZh: string,
    time: string,
    version: string
  ) {
    const newUpdateLog = new UpdateLogModel({
      type,
      content_en_us: contentEn,
      content_zh_cn: contentZh,
      time,
      version
    })
    await newUpdateLog.save()
  }

  async getUpdateLogs (page: number, limit: number) {
    const skip = (page - 1) * limit

    const updateLogs = await UpdateLogModel.find()
      .sort({ upid: -1 })
      .skip(skip)
      .limit(limit)

    const data = updateLogs.map((log) => ({
      upid: log.upid,
      contentEn: log.content_en_us,
      contentZh: log.content_zh_cn,
      time: log.time,
      version: log.version
    }))

    return data
  }

  async updateUpdateLog (
    upid: number,
    contentEn: string,
    contentZh: string,
    version: string
  ) {
    await UpdateLogModel.updateOne(
      { upid },
      { content_en_us: contentEn, content_zh_cn: contentZh, version }
    )
  }

  async deleteUpdateLog (id: number) {
    const deletedUpdateLog = await UpdateLogModel.findByIdAndDelete(id)
    return deletedUpdateLog
  }
}

export default new UpdateLogService()
