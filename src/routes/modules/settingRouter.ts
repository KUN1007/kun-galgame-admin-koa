import Router from 'koa-router'
import SettingController from '@/controller/settingController'

const router = new Router()

router.prefix('/api/setting')

router.get('/register', SettingController.getKunSetting)

router.post('/register', SettingController.updateKunSetting)

export default router
