import TodoModel from '@/models/todo'

class TodoService {
  async getTodoByTodoId(todoId: number) {
    return await TodoModel.findOne({ todo_id: todoId })
  }

  async createTodo(
    creatorUid: number,
    contentEn: string,
    contentZh: string,
    status: number
  ) {
    const newTodo = new TodoModel({
      completer_uid: creatorUid,
      content_en_us: contentEn,
      content_zh_cn: contentZh,
      status,
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
      .populate('creator', 'uid avatar name')
      .populate('completer', 'uid avatar name')
      .lean()

    const data = todos.map((todo) => ({
      todoId: todo.todo_id,
      status: todo.status,
      contentEn: todo.content_en_us,
      contentZh: todo.content_zh_cn,
      creator: {
        uid: todo.creator[0].uid,
        avatar: todo.creator[0].avatar,
        name: todo.creator[0].name,
      },
      time: todo.time,
      completer: {
        uid: todo.completer[0].uid,
        avatar: todo.completer[0].avatar,
        name: todo.completer[0].name,
      },
      completedTime: todo.completed_time,
    }))

    return data
  }

  async updateTodo(
    todo_id: number,
    contentEn: string,
    contentZh: string,
    status: number,
    completerUid?: number
  ) {
    const time = status === 2 ? Date.now() : 0

    await TodoModel.updateOne(
      { todo_id },
      {
        completer_uid: completerUid ?? 0,
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
