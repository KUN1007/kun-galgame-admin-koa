import Router from 'koa-router'
import TopicController from '@/controller/topicController'
import ReplyController from '@/controller/replyController'

const router = new Router()

router.prefix('/api/topics')

router.get('/:tid', TopicController.getTopicByTid)

router.put('/:tid', TopicController.updateTopic)

router.get('/:tid/replies', ReplyController.getReplies)

router.put('/:tid/reply', ReplyController.updateReply)

export default router
