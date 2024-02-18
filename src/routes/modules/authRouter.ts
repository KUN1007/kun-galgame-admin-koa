import Router from 'koa-router'
import AuthController from '@/controller/authController'

const router = new Router()

router.prefix('/api/auth')

router.post('/token/refresh', AuthController.generateTokenByRefreshToken)

export default router
