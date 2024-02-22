import Router from 'koa-router'
import UserController from '@/controller/userController'

const router = new Router()

router.prefix('/api/user')

router.post('/login', UserController.login)

router.put('/ban', UserController.banUserByUid)

router.put('/unban', UserController.unbanUserByUid)

router.get('/:uid', UserController.getUserByUid)

router.put('/:uid/bio', UserController.banUserByUid)

router.get('/:uid/topics', UserController.getUserTopics)

router.get('/:uid/replies', UserController.getUserReplies)

router.get('/:uid/comments', UserController.getUserComments)

export default router
