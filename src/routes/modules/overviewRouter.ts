import Router from 'koa-router'
import OverviewController from '@/controller/overviewController'

const router = new Router()

router.prefix('/api/overview')

router.get('/', OverviewController.getOverviewData)

router.get('/sum', OverviewController.getSumData)

router.get('/line', OverviewController.getWeekData)

export default router
