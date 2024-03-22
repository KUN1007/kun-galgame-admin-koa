import TodoModel from '@/models/todo'

class TodoService {
  async getTodoByTodoId(todoId: number) {
    return await TodoModel.findOne({ todo_id: todoId })
  }

  async createTodo(creator: string, creator_id: number, contentEn: string, contentZh: string, status: number) {
    const newTodo = new TodoModel({
      content_en_us: contentEn,
      content_zh_cn: contentZh,
      status,
      creator,
      creator_id,
      time: Date.now(),
    })
    const savedTodo = await newTodo.save()
    return savedTodo
  }

  async getTodos(page: number, limit: number) {
    const skip = (page - 1) * limit

    const todos = await TodoModel.find()
      .sort({ todo_id: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const data = todos.map((todo) => ({
      todoId: todo.todo_id,
      status: todo.status,
      contentEn: todo.content_en_us,
      contentZh: todo.content_zh_cn,
      time: todo.time,
      completedTime: todo.completed_time,
    }))

    return data
  }

  async updateTodo(
    todo_id: number,
    updater: string, 
    updater_id: number, 
    contentEn: string,
    contentZh: string,
    status: number
  ) {
    const time = status === 2 ? Date.now() : 0

    await TodoModel.updateOne(
      { todo_id },
      {
        completer: status === 2 ? updater : null,
        completer_id: status === 2 ? updater_id : null,
        content_en_us: contentEn,
        content_zh_cn: contentZh,
        status,
        completed_time: time,
      }
    )
  }

  async deleteTodo(todo_id: number) {
    await TodoModel.deleteOne({ todo_id })
  }
}

export default new TodoService()
