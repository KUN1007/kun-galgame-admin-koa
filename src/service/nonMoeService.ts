import NonMoeModel from '@/models/nonMoe'

class NonMoeService {
  async createNonMoeLog(
    uid: number,
    name: string,
    description: KunLanguage,
    time: number,
    result: string
  ) {
    await NonMoeModel.create({
      uid,
      name,
      description,
      time,
      result
    })
  }

  async getNonMoeLogs(uid?: number) {
    const result = uid
      ? await NonMoeModel.find({ uid }).lean().sort({ nid: -1 })
      : await NonMoeModel.find().lean().sort({ nid: -1 })

    return result
  }

  async updateNonMoeLog(nid: number, result: any) {
    await NonMoeModel.updateOne({ nid }, result)
  }

  async withdrawNonMoeLog(nid: number) {
    await NonMoeModel.deleteOne({ nid })
  }
}

export default new NonMoeService()
