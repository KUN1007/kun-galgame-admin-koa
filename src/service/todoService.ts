import TodoModel from '@/models/todo'

class TodoService {
  async createTodo(content: string, language: Language) {
    const newTodo = new TodoModel({ content, language })
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

  async updateTodo(upid: number, description: string, version: string) {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      upid,
      { description, version },
      { new: true }
    )
    return updatedTodo
  }

  async deleteTodo(id: number) {
    const deletedTodo = await TodoModel.findByIdAndDelete(id)
    return deletedTodo
  }
}

export default new TodoService()
