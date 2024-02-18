import UpdateLogModel from '@/models/updateLog'
import { UpdateLogAttributes } from '@/models/types/updateLog'

class UpdateLogService {
  async createUpdateLog(updateLogData: UpdateLogAttributes) {
    const newUpdateLog = new UpdateLogModel(updateLogData)
    const savedUpdateLog = await newUpdateLog.save()
    return savedUpdateLog
  }

  async getUpdateLogs(page: number, limit: number) {
    const skip = (page - 1) * limit

    const updateLogs = await UpdateLogModel.find()
      .sort({ upid: -1 })
      .skip(skip)
      .limit(limit)

    const data = updateLogs.map((log) => ({
      upid: log.upid,
      description: log.description,
      time: log.time,
      version: log.version,
    }))

    return data
  }

  async updateUpdateLog(upid: number, description: string, version: string) {
    const updatedUpdateLog = await UpdateLogModel.findByIdAndUpdate(
      upid,
      { description, version },
      { new: true }
    )
    return updatedUpdateLog
  }

  async deleteUpdateLog(id: number) {
    const deletedUpdateLog = await UpdateLogModel.findByIdAndDelete(id)
    return deletedUpdateLog
  }
}

export default new UpdateLogService()
