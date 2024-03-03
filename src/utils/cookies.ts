import { Context } from 'koa'
import { verifyJWTPayload } from './jwt'

export function setCookieAdminToken(ctx: Context, token: string) {
  ctx.cookies.set('kungalgame-admin-token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function getCookieTokenInfo(ctx: Context) {
  const refreshToken = ctx.cookies.get('kungalgame-admin-token')

  try {
    const user = verifyJWTPayload(refreshToken)
    return user
  } catch (error) {
    console.log('Get user info from cookies error', error)
  }
}
