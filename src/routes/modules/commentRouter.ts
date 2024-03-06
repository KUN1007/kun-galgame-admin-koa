import Router from 'koa-router'
import CommentController from '@/controller/commentController'

const router = new Router()

router.prefix('/api/comment')

router.get('/', CommentController.getComments)

router.put('/', CommentController.updateCommentsByCid)

router.del('/', CommentController.deleteCommentsByCid)

router.get('/today', CommentController.getNewCommentToday)

export default router
