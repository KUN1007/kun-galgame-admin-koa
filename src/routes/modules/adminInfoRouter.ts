import Router from 'koa-router'
import AdminInfoController from '@/controller/adminInfoController'
import UserController from '@/controller/userController'

const router = new Router()

router.prefix('/api/admin')

router.get('/info', AdminInfoController.getAdminInfos)

router.put('/set', UserController.updateUserRoles)

export default router
