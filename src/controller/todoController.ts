import { Context } from 'koa'
import TodoService from '@/service/todoService'
import AdminInfoService from '@/service/adminInfoService'

class TodoController {
  async createTodo(ctx: Context) {
    const { content, language } = ctx.request.body
    ctx.body = await TodoService.createTodo(content, language)

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} create a todo\nContent: ${content}`
    )
  }

  async getTodos(ctx: Context) {
    const page = ctx.query.page as string
    const limit = ctx.query.limit as string
    const language = ctx.query.language as Language | undefined

    ctx.body = await TodoService.getTodos(
      parseInt(page),
      parseInt(limit),
      language
    )
  }

  async updateTodo(ctx: Context) {
    const { upid, description, version } = ctx.request.body
    ctx.body = await TodoService.updateTodo(upid, description, version)
  }

  async deleteTodo(ctx: Context) {
    const upid = parseInt(ctx.query.upid as string)
    ctx.body = await TodoService.deleteTodo(upid)
  }
}

export default new TodoController()
