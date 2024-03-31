import { type Context, type Middleware } from 'koa'

export const kungalgameResponseMiddleware = (): Middleware => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()

      if (ctx.status === 233) {
        return
      }

      ctx.status = 200
      ctx.body = {
        data: ctx.body,
        code: 200,
        message: 'OK'
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: ctx.message || 'ERROR',
        data: {}
      }
    }
  }
}
