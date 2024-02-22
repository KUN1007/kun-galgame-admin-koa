import Router from 'koa-router'
import CommentController from '@/controller/commentController'

const router = new Router()

router.prefix('/api/comment')

router.get('/', CommentController.getCommentCidByContent)

router.put('/', CommentController.updateCommentsByReplyRid)

export default router
