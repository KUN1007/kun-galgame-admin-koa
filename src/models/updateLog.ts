import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequence'

import type { UpdateLogAttributes } from './types/updateLog'

const UpdateLogSchema = new mongoose.Schema<UpdateLogAttributes>(
  {
    upid: { type: Number, unique: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    time: { type: String, default: '' },
    version: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

UpdateLogSchema.pre('save', increasingSequence('upid'))

const UpdateLogModel = mongoose.model<UpdateLogAttributes>(
  'update_log',
  UpdateLogSchema
)

export default UpdateLogModel
