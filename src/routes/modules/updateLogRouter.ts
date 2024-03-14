import Router from 'koa-router'
import TodoController from '@/controller/todoController'

import UpdateLogController from '@/controller/updateLogController'

const router = new Router()

router.prefix('/api/update')

router.post('/todo', TodoController.createTodo)

router.get('/todo', TodoController.getTodos)

router.put('/todo', TodoController.updateTodo)

router.delete('/todo', TodoController.deleteTodo)

router.post('/history', UpdateLogController.createUpdateLog)

router.get('/history', UpdateLogController.getUpdateLogs)

router.put('/history', UpdateLogController.updateUpdateLog)

router.delete('/history', UpdateLogController.deleteUpdateLog)

export default router
