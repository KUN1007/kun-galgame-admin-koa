import { Context } from 'koa'
import UserService from '@/service/userService'
import { setCookieRefreshToken, getCookieTokenInfo } from '@/utils/cookies'
import { setValue, getValue, delValue } from '@/config/redisConfig'

import { isValidEmail, isValidName, isValidPassword } from '@/utils/validate'

import type { SortOrder, SortFieldRanking } from './types/userController'

class UserController {
  async login(ctx: Context) {
    const { name, password } = ctx.request.body

    if (
      !(isValidName(name) || isValidEmail(name)) ||
      !isValidPassword(password)
    ) {
      ctx.app.emit('kunError', 10107, ctx)
      return
    }

    const loginCD = await getValue(`loginCD:${name}`)

    if (loginCD) {
      ctx.app.emit('kunError', 10112, ctx)
      return
    } else {
      setValue(`loginCD:${name}`, name, 60)
    }

    const result = await UserService.loginUser(name, password)

    if (typeof result === 'number') {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    setCookieRefreshToken(ctx, result.refreshToken)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: result.data,
    }
  }

  async getUserByUsername(ctx: Context) {
    const name = ctx.query.name as string

    const user = await UserService.getUserByUsername(name)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: user,
    }
  }

  async banUserByUid(ctx: Context) {
    const uid = ctx.request.body.uid as string

    await delValue(`refreshToken:${uid}`)
    await UserService.updateUserByUid(uid, 'status', '1')

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  async unbanUserByUid(ctx: Context) {
    const uid = ctx.request.body.uid as string
    await UserService.updateUserByUid(uid, 'status', '0')

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  async getUserByUid(ctx: Context) {
    const uid = parseInt(ctx.params.uid as string)
    const user = await UserService.getUserByUid(uid)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: user,
    }
  }

  async updateUserByUid(ctx: Context) {
    const uid = getCookieTokenInfo(ctx).uid

    const { fieldToUpdate, newFieldValue } = ctx.request.body

    await UserService.updateUserByUid(
      uid.toString(),
      fieldToUpdate,
      newFieldValue
    )

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  async getUserTopics(ctx: Context) {
    const tidArray = ctx.query.tidArray as string

    if (!tidArray) {
      ctx.body = {
        code: 200,
        message: 'OK',
        data: [],
      }
      return
    }

    const numberArray = tidArray.split(',').map((tid) => parseInt(tid))
    const result = await UserService.getUserTopics(numberArray)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: result,
    }
  }

  async getUserReplies(ctx: Context) {
    const ridArray = ctx.query.ridArray as string

    if (!ridArray) {
      ctx.body = {
        code: 200,
        message: 'OK',
        data: [],
      }
      return
    }

    const numberArray = ridArray.split(',').map((rid) => parseInt(rid))
    const result = await UserService.getUserReplies(numberArray)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: result,
    }
  }

  async getUserComments(ctx: Context) {
    const cidArray = ctx.query.cidArray as string

    if (!cidArray) {
      ctx.body = {
        code: 200,
        message: 'OK',
        data: [],
      }
      return
    }

    const numberArray = cidArray.split(',').map((cid) => parseInt(cid))
    const result = await UserService.getUserComments(numberArray)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: result,
    }
  }

  async getUserRanking(ctx: Context) {
    const { page, limit, sortField, sortOrder } = ctx.query

    const topics = await UserService.getUserRanking(
      parseInt(page as string),
      parseInt(limit as string),
      sortField as SortFieldRanking,
      sortOrder as SortOrder
    )
    ctx.body = { code: 200, message: 'OK', data: topics }
  }
}

export default new UserController()
