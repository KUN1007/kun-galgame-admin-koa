import Router from 'koa-router'
import TopicController from '@/controller/topicController'
import UserController from '@/controller/userController'

const router = new Router()

router.prefix('/api/ranking')

router.get('/topics', TopicController.getTopicRanking)

router.get('/users', UserController.getUserRanking)

export default router
