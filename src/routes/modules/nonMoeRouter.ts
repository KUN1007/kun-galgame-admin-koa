import Router from 'koa-router'
import NonMoeController from '@/controller/nonMoeController'

const router = new Router()

router.prefix('/api/non-moe')

router.post('/', NonMoeController.createNonMoeLog)

router.get('/', NonMoeController.getNonMoeLogs)

router.get('/:uid', NonMoeController.getNonMoeLogsByUid)

router.put('/:nid', NonMoeController.updateNonMoeLog)

router.del('/:nid', NonMoeController.withdrawNonMoeLog)

export default router
