import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequence'
import type { AdminInfoAttributes } from './types/adminInfo'

const AdminInfoSchema = new mongoose.Schema<AdminInfoAttributes>(
  {
    ai_id: { type: Number, unique: true },
    uid: { type: Number, required: true, ref: 'user' },
    type: { type: String, required: true },
    content: { type: String, default: '' },
    time: { type: Number, default: Date.now() }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

AdminInfoSchema.virtual('sender', {
  ref: 'user',
  localField: 'uid',
  foreignField: 'uid'
})

AdminInfoSchema.pre('save', increasingSequence('ai_id'))

const AdminInfoModel = mongoose.model<AdminInfoAttributes>(
  'admin_infos',
  AdminInfoSchema
)

export default AdminInfoModel
