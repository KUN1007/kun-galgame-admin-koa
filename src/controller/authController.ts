import { Context } from 'koa'
import AuthService from '@/service/authService'

class AuthController {
  async generateTokenByRefreshToken(ctx: Context) {
    const refreshToken = ctx.cookies.get('kungalgame-moemoe-refresh-token')

    const newToken = await AuthService.generateTokenByRefreshToken(refreshToken)

    if (newToken) {
      ctx.status = 200
      ctx.body = {
        code: 200,
        message: 'Token refresh successfully',
        data: {
          token: newToken,
        },
      }
    } else {
      ctx.status = 401
      ctx.body = 'Unauthorized'
    }
  }
}

export default new AuthController()
