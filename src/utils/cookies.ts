import { Context } from 'koa'
import { verifyJWTPayload } from './jwt'

export function setCookieRefreshToken(ctx: Context, token: string) {
  ctx.cookies.set('kungalgame-moemoe-refresh-token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function getCookieTokenInfo(ctx: Context) {
  const refreshToken = ctx.cookies.get('kungalgame-moemoe-refresh-token')

  try {
    const user = verifyJWTPayload(refreshToken)
    return user
  } catch (error) {
    console.log('Get user info from cookies error', error)
  }
}
