import Router from 'koa-router'
import messageAdminController from '@/controller/messageAdminController'

const router = new Router()

router.prefix('/api/message-admin')

router.post('/', messageAdminController.createMessageAdmin)

router.get('/', messageAdminController.getMessageAdmins)

router.delete('/', messageAdminController.deleteMessageAdmin)

export default router
