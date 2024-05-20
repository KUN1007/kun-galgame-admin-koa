import BalanceModel from '@/models/balance'
import { Balance, SearchBalance } from '@/models/types/balance';

class BalanceService {
    async createBalance(isIncome: boolean, money: number, reasonText: KunLanguage, dealTime: number, status: number) {
        await BalanceModel.create({
            type: isIncome ? "income": "expenditure",
            reason: reasonText,
            amount: money,
            status,
            time: dealTime,
        })
    }

    mapBalance(data: Array<Balance>) {
        return data.map((bill) => ({
            bid: bill.bid,
            reason: bill.reason,
            type: bill.type === "income" ? true : false,
            time: bill.time,
            amount: bill.amount,
            status: bill.status,
        }));
    }

    async getBalance() {
        const bills = await BalanceModel.find();
        const data = this.mapBalance(bills);
        return data;
    }

    async getBalanceByType(type: number) {
        const keyword = type > 0 ? "income" : "expenditure"
        const bills = await BalanceModel.find({ type: keyword });
        const data = this.mapBalance(bills);
        return data;
    }

    async getBalanceByAmount(req: SearchBalance) {
        var bills;
        if (req.type === 2) {
            bills = await BalanceModel.find({ amount: { $gte: req.min, $lte: req.max } });
        } else {
            const keyword = req.type > 0 ? "income" : "expenditure";
            bills = await BalanceModel.find({ amount: { $gte: req.min, $lte: req.max }, type: keyword });
        }

        const data = this.mapBalance(bills);

        return data;
    }

    async getBalanceLimit(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const bills = await BalanceModel.find().skip(skip).limit(limit);
        const data = this.mapBalance(bills);
        return data;
    }

    async getBalanceByConditions(request: SearchBalance) {
        var bills;
        if (request.type === 2) {
            bills = await BalanceModel.find({
                amount: { $gte: request.min, $lte: request.max },
                time: { $gte: request.start, $lte: request.end },
            });
        } else {
            const keyword = request.type > 0 ? "income" : "expenditure";
            bills = await BalanceModel.find({
                type: keyword,
                amount: { $gte: request.min, $lte: request.max },
                time: { $gte: request.start, $lte: request.end },
            });
        }

        const data = this.mapBalance(bills);
        return data;
    }

    async getBalanceByConditionsLimit(request: SearchBalance) {
        const skip = (request.page - 1) * request.limit;
        var bills;
        if (request.type === 2) {
            bills = await BalanceModel.find({
                amount: { $gte: request.min, $lte: request.max },
                time: { $gte: request.start, $lte: request.end },
            }).skip(skip).limit(request.limit);
        } else {
            const keyword = request.type > 0 ? "income" : "expenditure";
            bills = await BalanceModel.find({
                type: keyword,
                amount: { $gte: request.min, $lte: request.max },
                time: { $gte: request.start, $lte: request.end },
            }).skip(skip).limit(request.limit);
        }
        const data = this.mapBalance(bills);
        return data;
    }

    async deleteBalance(bid: number) {
        await BalanceModel.deleteOne({ bid });
    }

    async updateBalance(bid: number, data: any) {
        await BalanceModel.updateOne({ bid }, data);
    }
}

export default new BalanceService()