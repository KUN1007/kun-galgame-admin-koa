import { Context } from 'koa'
import TodoService from '@/service/todoService'
import AdminInfoService from '@/service/adminInfoService'

class TodoController {
  async createTodo(ctx: Context) {
    const { creatorUid, contentEn, contentZh, status } = ctx.request.body

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} created a todo\nContent: ${contentEn}`
    )

    ctx.body = await TodoService.createTodo(
      creatorUid,
      contentEn,
      contentZh,
      status
    )
  }

  async getTodos(ctx: Context) {
    const page = ctx.query.page as string
    const limit = ctx.query.limit as string

    ctx.body = await TodoService.getTodos(parseInt(page), parseInt(limit))
  }

  async updateTodo(ctx: Context) {
    const { todoId, contentEn, contentZh, status, completerUid } =
      ctx.request.body

    const todo = await TodoService.getTodoByTodoId(todoId)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} updated a todo\nTodo ID: ${todo.todo_id}\nOriginal todo content: ${todo.content_en_us}\nOriginal todo status: ${todo.status}`
    )

    await TodoService.updateTodo(
      todoId,
      contentEn,
      contentZh,
      status,
      completerUid
    )
  }

  async deleteTodo(ctx: Context) {
    const todoId = parseInt(ctx.query.todoId as string)

    const todo = await TodoService.getTodoByTodoId(todoId)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a todo\nOriginal todo: ${todo}`
    )

    await TodoService.deleteTodo(todoId)
  }
}

export default new TodoController()
