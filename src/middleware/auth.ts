import { Context, Middleware } from 'koa'
import { verifyJWTPayloadByHeader } from '@/utils/jwt'

const whitelistRegex =
  /^\/api\/(auth|public|user\/login|user\/register|balance|non-moe)|uploads\/avatar|uploads\/login/

export const kungalgameAuthMiddleware = (): Middleware => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const path = ctx.request.path

    const isWhitelisted = whitelistRegex.test(path)

    if (isWhitelisted) {
      await next()
      return
    }

    const authorizationHeader = ctx.headers.authorization

    if (!authorizationHeader) {
      ctx.status = 401
      ctx.body = 'Unauthorized'
      return
    }

    const decoded = verifyJWTPayloadByHeader(authorizationHeader)
    if (!decoded) {
      ctx.status = 401
      ctx.body = 'Unauthorized'
      return
    }

    if (
      !decoded.uid ||
      decoded.iss !== 'kungalgame' ||
      decoded.aud !== 'kungalgamer'
    ) {
      ctx.status = 401
      ctx.body = 'Non moemoe!'
      return
    }

    ctx.state.user = decoded

    await next()
  }
}
