import { Context } from 'koa'
import UserService from '@/service/userService'
import AdminInfoService from '@/service/adminInfoService'
import { setCookieAdminToken, getCookieTokenInfo } from '@/utils/cookies'
import { setValue, getValue, delValue } from '@/config/redisConfig'
import { isValidEmail, isValidName, isValidPassword } from '@/utils/validate'

class UserController {
  async login(ctx: Context) {
    const { name, password } = ctx.request.body

    if (
      !(isValidName(name) || isValidEmail(name)) ||
      !isValidPassword(password)
    ) {
      ctx.app.emit('kunError', 10104, ctx)
      return
    }

    const loginCD = await getValue(`loginCD:${name}`)
    if (loginCD) {
      ctx.app.emit('kunError', 10105, ctx)
      return
    } else {
      setValue(`loginCD:${name}`, name, 60)
    }

    const result = await UserService.loginUser(name, password)
    if (typeof result === 'number') {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    setCookieAdminToken(ctx, result.token)

    ctx.body = result
  }

  async getUserByUsername(ctx: Context) {
    const name = ctx.query.name as string
    if (!name.trim()) {
      ctx.app.emit('kunError', 10601, ctx)
      return
    }
    ctx.body = await UserService.getUserByUsername(name)
  }

  async banUserByUid(ctx: Context) {
    const uid = ctx.request.body.uid as string

    const banUser = await UserService.getUserInfoByUid(parseInt(uid), ['name'])
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} banned ${banUser.name}\nUID: ${uid}`
    )

    await delValue(`refreshToken:${uid}`)
    await UserService.updateUserByUid(uid, 'status', '1')
  }

  async unbanUserByUid(ctx: Context) {
    const uid = ctx.request.body.uid as string

    const unbanUser = await UserService.getUserInfoByUid(parseInt(uid), [
      'name',
    ])
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} unbanned ${unbanUser.name}\nUID: ${uid}`
    )

    await UserService.updateUserByUid(uid, 'status', '0')
  }

  async deleteUserByUid(ctx: Context) {
    const roles = getCookieTokenInfo(ctx).roles
    if (roles <= 2) {
      ctx.app.emit('kunError', 10107, ctx)
      return
    }

    const uid = ctx.params.uid as string
    const user = ctx.state.user

    const deletedUser = await UserService.getUserByUid(
      parseInt(uid),
      user.roles
    )
    const userString = JSON.stringify(deletedUser)
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted ${deletedUser.name}\nUID: ${uid}\nUser Info: ${userString}`
    )

    await delValue(`refreshToken:${uid}`)
    await UserService.deleteUserByUid(parseInt(uid))
  }

  async getUserByUid(ctx: Context) {
    const uid = parseInt(ctx.params.uid as string)
    const user = ctx.state.user
    ctx.body = await UserService.getUserByUid(uid, user.roles)
  }

  async getUserTopics(ctx: Context) {
    const tidArray = ctx.query.tidArray as string

    if (!tidArray) {
      return
    }

    const numberArray = tidArray.split(',').map((tid) => parseInt(tid))
    ctx.body = await UserService.getUserTopics(numberArray)
  }

  async getUserReplies(ctx: Context) {
    const ridArray = ctx.query.ridArray as string

    if (!ridArray) {
      return
    }

    const numberArray = ridArray.split(',').map((rid) => parseInt(rid))
    ctx.body = await UserService.getUserReplies(numberArray)
  }

  async getUserComments(ctx: Context) {
    const cidArray = ctx.query.cidArray as string

    if (!cidArray) {
      return
    }

    const numberArray = cidArray.split(',').map((cid) => parseInt(cid))
    ctx.body = await UserService.getUserComments(numberArray)
  }
}

export default new UserController()
