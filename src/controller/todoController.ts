import { Context } from 'koa'
import TodoService from '@/service/todoService'
import AdminInfoService from '@/service/adminInfoService'

class TodoController {
  async createTodo(ctx: Context) {
    const { content, status, language } = ctx.request.body
    ctx.body = await TodoService.createTodo(content, status, language)

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
    const { todoId, content, status } = ctx.request.body

    const todo = await TodoService.getTodoByTodoId(todoId)
    const user = ctx.state.user
    await AdminInfoService.createAdminInfo(
      user.uid,
      'update',
      `${user.name} update a todo\nTodo ID: ${todo.todo_id}\nOriginal todo content: ${todo.content}\nOriginal todo status: ${todo.status}`
    )

    await TodoService.updateTodo(todoId, content, status)
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
