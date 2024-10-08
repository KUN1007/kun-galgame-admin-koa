import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequence'
import type { TodoAttributes } from './types/todo'

const TodoSchema = new mongoose.Schema<TodoAttributes>(
  {
    todo_id: { type: Number, unique: true },
    status: { type: Number, default: 0 },
    content: {
      'en-us': { type: String, default: '' },
      'ja-jp': { type: String, default: '' },
      'zh-cn': { type: String, default: '' },
      'zh-tw': { type: String, default: '' }
    },
    creator_uid: { type: Number, require: true, ref: 'user' },
    time: { type: Number, default: Date.now() },
    completer_uid: { type: Number, default: 2, ref: 'user' },
    completed_time: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

TodoSchema.virtual('creator', {
  ref: 'user',
  localField: 'creator_uid',
  foreignField: 'uid'
})

TodoSchema.virtual('completer', {
  ref: 'user',
  localField: 'completer_uid',
  foreignField: 'uid'
})

TodoSchema.pre('save', increasingSequence('todo_id'))

const TodoModel = mongoose.model<TodoAttributes>('todo', TodoSchema)

export default TodoModel
