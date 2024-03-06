import Router from 'koa-router'
import TopicController from '@/controller/topicController'

const router = new Router()

router.prefix('/api/topic')

router.get('/', TopicController.getTopicsByContentApi)

router.put('/', TopicController.updateTopicByTid)

router.del('/', TopicController.deleteTopicByTid)

router.get('/today', TopicController.getNewTopicToday)

router.put('/status', TopicController.updateTopicStatus)

export default router
