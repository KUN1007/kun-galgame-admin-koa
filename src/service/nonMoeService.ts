import NonMoeModel from '@/models/nonMoe'

type SortOrder = 'asc' | 'desc'

class NonMoeService {
  async createNonMoeLog(
    uid: number,
    name: string,
    description: string,
    time: number,
    result: string
  ) {
    const newIncome = new NonMoeModel({
      uid,
      name,
      description,
      time,
      result,
    })

    await newIncome.save()
  }

  async getNonMoeLogs(page: number, limit: number, sortOrder: SortOrder) {
    const skip = (page - 1) * limit

    const nonMoeLogs = await NonMoeModel.find()
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = nonMoeLogs.map((log) => ({
      nid: log.nid,
      uid: log.uid,
      name: log.name,
      description: log.description,
      time: log.time,
      result: log.result,
    }))

    return responseData
  }
}

export default new NonMoeService()
