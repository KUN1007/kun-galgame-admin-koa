import Router from 'koa-router'
import PLController from '@/controller/plController'

const router = new Router()

router.prefix('/api/balance')

router.post('/income', PLController.createIncome)

router.post('/expenditure', PLController.createExpenditure)

router.get('/income', PLController.getIncomes)

router.get('/expenditure', PLController.getExpenditures)

router.get('/statement', PLController.getPLStatement)

export default router
