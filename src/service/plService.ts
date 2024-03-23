import IncomeModel from '@/models/income'
import ExpenditureModel from '@/models/expenditure'
import mongoose from '@/db/connection'

type SortField = 'time' | 'amount'
type SortOrder = 'asc' | 'desc'

class PLService {
  async createIncome(reason: string, time: number, amount: number) {
    const newIncome = new IncomeModel({
      reason,
      time,
      amount
    })

    await newIncome.save()
  }

  async createExpenditure(reason: string, time: number, amount: number) {
    const newExpenditure = new ExpenditureModel({
      reason,
      time,
      amount
    })

    await newExpenditure.save()
  }

  async getIncomes(
    page: number,
    limit: number,
    sortField: SortField,
    sortOrder: SortOrder
  ) {
    const skip = (page - 1) * limit

    const sortOptions: Record<string, 'asc' | 'desc'> = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc'
    }

    const incomeDetails = await IncomeModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = incomeDetails.map((income) => ({
      iid: income.iid,
      reason: income.reason,
      time: income.time,
      amount: income.amount
    }))

    return responseData
  }

  async getExpenditures(
    page: number,
    limit: number,
    sortField: SortField,
    sortOrder: SortOrder
  ) {
    const skip = (page - 1) * limit

    const sortOptions: Record<string, 'asc' | 'desc'> = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc'
    }

    const expenditureModelDetails = await ExpenditureModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = expenditureModelDetails.map((expenditure) => ({
      eid: expenditure.eid,
      reason: expenditure.reason,
      time: expenditure.time,
      amount: expenditure.amount
    }))

    return responseData
  }

  async getPLStatement() {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const totalIncomeResult = await IncomeModel.aggregate([
        {
          $group: {
            _id: null,
            totalIncome: { $sum: '$amount' }
          }
        }
      ])

      const totalExpenditureResult = await ExpenditureModel.aggregate([
        {
          $group: {
            _id: null,
            totalExpenditure: { $sum: '$amount' }
          }
        }
      ])

      const totalIncome: number =
        totalIncomeResult.length > 0 ? totalIncomeResult[0].totalIncome : 0
      const totalExpenditure: number =
        totalExpenditureResult.length > 0
          ? totalExpenditureResult[0].totalExpenditure
          : 0

      const profitLoss = totalIncome - totalExpenditure

      await session.commitTransaction()

      return {
        totalIncome,
        totalExpenditure,
        profitLoss
      }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }
}

export default new PLService()
