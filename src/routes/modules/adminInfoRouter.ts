import Router from 'koa-router'
import AdminInfoController from '@/controller/adminInfoController'

const router = new Router()

router.prefix('/api/admin')

router.get('/info', AdminInfoController.getAdminInfos)

export default router
