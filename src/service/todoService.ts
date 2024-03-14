import TodoModel from '@/models/todo'

class TodoService {
  async getTodoByTodoId(todoId: number) {
    return await TodoModel.findOne({ todo_id: todoId })
  }

  async createTodo(content: string, status: number, language: Language) {
    const newTodo = new TodoModel({
      content,
      status,
      language,
      time: Date.now(),
    })
    const savedTodo = await newTodo.save()
    return savedTodo
  }

  async getTodos(page: number, limit: number, language?: Language) {
    const skip = (page - 1) * limit

    const findOptions = language ? { language } : {}

    const todos = await TodoModel.find(findOptions)
      .sort({ todo_id: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const data = todos.map((todo) => ({
      todoId: todo.todo_id,
      status: todo.status,
      content: todo.content,
      language: todo.language,
      time: todo.time,
      completedTime: todo.completed_time,
    }))

    return data
  }

  async updateTodo(todo_id: number, content: string, status: number) {
    await TodoModel.updateOne({ todo_id }, { content, status })
  }

  async deleteTodo(todo_id: number) {
    await TodoModel.deleteOne({ todo_id })
  }
}

export default new TodoService()
