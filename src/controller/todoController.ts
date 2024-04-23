import { type Context } from 'koa'
import TodoService from '@/service/todoService'
import AdminInfoService from '@/service/adminInfoService'

class TodoController {
  async createTodo(ctx: Context) {
    const { content, status } = ctx.request.body

    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} created a todo\nContent: ${content['en-us']}`
    )

    await TodoService.createTodo(user.uid, content, status)
  }

  async getTodos(ctx: Context) {
    const page = ctx.query.page as string
    const limit = ctx.query.limit as string

    ctx.body = await TodoService.getTodos(parseInt(page), parseInt(limit))
  }

  async updateTodo(ctx: Context) {
    const { todoId, content, status } = ctx.request.body

    const todo = await TodoService.getTodoByTodoId(todoId)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} updated a todo\nTodo ID: ${todo?.todo_id}\nOriginal todo content: ${todo?.content['en-us']}\nOriginal todo status: ${todo?.status}`
    )

    await TodoService.updateTodo(todoId, content, status, user.uid)
  }

  async deleteTodo(ctx: Context) {
    const todoId = parseInt(ctx.query.todoId as string)

    const todo = await TodoService.getTodoByTodoId(todoId)
    const todoString = JSON.stringify(todo)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'delete',
      `${user.name} deleted a todo\nOriginal todo: ${todoString}`
    )

    await TodoService.deleteTodo(todoId)
  }
}

export default new TodoController()
