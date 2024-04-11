import ReportModel from '@/models/report'
import { handleFilter } from '@/utils/mongoose'

interface GetReportListPayload {
  // page number
  pn?: number
  // page size
  ps?: number
  /**
   * report status
   * if undefined, return all
   */
  status?: number
  type?: string
}

class ReportService {
  async getReportList({ pn = 1, ps = 15, status, type }: GetReportListPayload) {
    // const filter = status === undefined ? {} : { status }
    const filter = handleFilter({
      status,
      type
    })
    const list = await ReportModel.find(filter, '-_id -__v')
      .sort({ report_id: -1 })
      .skip((pn - 1) * ps)
      .limit(ps)
    const total = await ReportModel.countDocuments(filter)

    return { list, pn, ps, total }
  }

  async updateReportStatus(id: number, status: number) {
    await ReportModel.updateOne({ report_id: id }, { status })
  }
}

export default new ReportService()
