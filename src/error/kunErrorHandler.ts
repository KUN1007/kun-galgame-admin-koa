import { Context } from 'koa'
import { errorMessages } from './kunErrorList'

const defaultErrorMessage = 'Unknown server error'

export const kungalgameErrorHandler = (code: number, ctx: Context) => {
  const errorMessage = errorMessages[code] || defaultErrorMessage

  ctx.status = 233

  ctx.body = {
    code,
    message: errorMessage,
  }
}
