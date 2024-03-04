import { Context, Middleware } from 'koa'

export const kungalgameResponseMiddleware = (): Middleware => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()

      if (ctx.status === 233) {
        return
      }

      ctx.body = {
        code: 200,
        message: 'OK',
        data: ctx.body,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: ctx.message || 'ERROR',
        data: {},
      }
    }
  }
}
