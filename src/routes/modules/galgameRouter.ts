import Router from 'koa-router'
import GalgameController from '@/controller/galgameController'

const router = new Router()

router.prefix('/api/galgame')

router.get('/', GalgameController.getGalgame)

router.del('/resource', GalgameController.deleteGalgameResource)

router.del('/comment', GalgameController.deleteGalgameComment)

export default router
