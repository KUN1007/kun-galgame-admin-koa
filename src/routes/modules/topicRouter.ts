import Router from 'koa-router'
import TopicController from '@/controller/topicController'
import ReplyController from '@/controller/replyController'
import CommentController from '@/controller/commentController'

const router = new Router()

router.prefix('/api/topics')

router.get('/:tid', TopicController.getTopicByTid)

router.put('/:tid', TopicController.updateTopic)

router.get('/:tid/replies', ReplyController.getReplies)

router.put('/:tid/reply', ReplyController.updateReply)

router.get('/:tid/comment', CommentController.getCommentsByReplyRid)

export default router
