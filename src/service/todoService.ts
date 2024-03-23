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
      creator_uid: creatorUid,
      content_en_us: contentEn,
      content_zh_cn: contentZh,
      status,
      time: Date.now()
    })
    await newTodo.save()
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
        name: todo.creator[0].name
      },
      time: todo.time,
      completer: {
        uid: todo.completer[0].uid,
        avatar: todo.completer[0].avatar,
        name: todo.completer[0].name
      },
      completedTime: todo.completed_time
    }))

    return data
  }

  async updateTodo(
    todoId: number,
    contentEn: string,
    contentZh: string,
    status: number,
    completerUid: number
  ) {
    const time = status === 2 ? Date.now() : 0

    await TodoModel.updateOne(
      { todo_id: todoId },
      {
        completer_uid: completerUid,
        content_en_us: contentEn,
        content_zh_cn: contentZh,
        status,
        completed_time: time
      }
    )
  }

  async deleteTodo(todoId: number) {
    await TodoModel.deleteOne({ todo_id: todoId })
  }
}

export default new TodoService()
