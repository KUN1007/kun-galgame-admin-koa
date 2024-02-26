import Router from 'koa-router'
import TopicController from '@/controller/topicController'

const router = new Router()

router.prefix('/api/topic')

router.get('/', TopicController.getTopicsByContentApi)

router.put('/', TopicController.updateTopic)

export default router
