import NonMoeModel from '@/models/nonMoe'

class NonMoeService {
  async createNonMoeLog(
    uid: number,
    name: string,
    description_en_us: string,
    description_zh_cn: string,
    time: number,
    result: string
  ) {
    const newIncome = new NonMoeModel({
      uid,
      name,
      description_en_us,
      description_zh_cn,
      time,
      result
    })

    await newIncome.save()
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
