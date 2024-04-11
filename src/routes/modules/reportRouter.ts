import Router from 'koa-router'
import ReportController from '@/controller/reportController'

const router = new Router()

router.prefix('/api/report')

router.get('/list', ReportController.getReportList)

router.post('/status', ReportController.updateReportStatus)

export default router
