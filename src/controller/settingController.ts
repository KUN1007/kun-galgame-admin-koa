import { type Context } from 'koa'
import { delValue, getValue, setValue } from '@/config/redisConfig'

const KUN_FORUM_DISABLE_REGISTER_KEY = 'admin:setting:register'

class SettingController {
  async getKunSetting(ctx: Context) {
    const isDisableKunForumRegister = await getValue(
      KUN_FORUM_DISABLE_REGISTER_KEY
    )
    ctx.body = {
      disableRegister: !!isDisableKunForumRegister
    }
  }

  async updateKunSetting(ctx: Context) {
    const { disableRegister } = ctx.request.body
    if (disableRegister) {
      await setValue(KUN_FORUM_DISABLE_REGISTER_KEY, 'true')
    } else {
      await delValue(KUN_FORUM_DISABLE_REGISTER_KEY)
    }
  }
}

export default new SettingController()
