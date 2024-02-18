import Router from 'koa-router'
import TopicController from '@/controller/topicController'

const router = new Router()

router.prefix('/api/home')

router.get('/search', TopicController.searchTopics)

export default router
