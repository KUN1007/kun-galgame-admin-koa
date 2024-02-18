import Router from 'koa-router'
import TagController from '@/controller/tagController'

const router = new Router()

router.prefix('/api/tag')

router.get('/popular', TagController.getTopTags)

export default router
