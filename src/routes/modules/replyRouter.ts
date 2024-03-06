import Router from 'koa-router'
import ReplyController from '@/controller/replyController'

const router = new Router()

router.prefix('/api/reply')

router.get('/', ReplyController.getReplies)

router.put('/', ReplyController.updateReply)

router.del('/', ReplyController.deleteReplyByRid)

router.get('/today', ReplyController.getNewReplyToday)

export default router
