import balanceController from '@/controller/balanceController'
import Router from 'koa-router'

const router = new Router();

router.prefix('/api/balance');

router.post('/', balanceController.CreateBalance);

router.get('/', balanceController.GetBalance);

router.del('/:bid', balanceController.DeleteBalance);

router.put('/:bid', balanceController.UpdateBalance);

export default router;