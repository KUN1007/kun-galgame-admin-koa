import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequence'

import type { TodoAttributes } from './types/todo'

const TodoSchema = new mongoose.Schema<TodoAttributes>(
  {
    todo_id: { type: Number, unique: true },
    status: { type: Number, default: 0 },
    content: { type: String, require: true },
    language: { type: String, require: true },
    time: { type: Number, default: Date.now() },
    completed_time: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

TodoSchema.pre('save', increasingSequence('todo_id'))

const TodoModel = mongoose.model<TodoAttributes>('todo', TodoSchema)

export default TodoModel
