import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequence'
import type { GalgameResource } from './types/galgame-resource'

const GalgameResourceSchema = new mongoose.Schema<GalgameResource>(
  {
    grid: { type: Number, unique: true },
    gid: { type: Number, required: true },
    uid: { type: Number, required: true, ref: 'user' },
    type: { type: String, default: '' },
    link: { type: [String], default: [] },
    language: { type: String, default: '' },
    platform: { type: String, default: '' },
    size: { type: String, default: '', maxlength: 107 },

    code: { type: String, default: '', maxlength: 1007 },
    password: { type: String, default: '', maxlength: 1007 },
    note: { type: String, default: '', maxlength: 1007 },

    time: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    likes: { type: [Number], default: [] }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

GalgameResourceSchema.virtual('user', {
  ref: 'user',
  localField: 'uid',
  foreignField: 'uid'
})

GalgameResourceSchema.pre('save', increasingSequence('grid'))

const GalgameResourceModel = mongoose.model<GalgameResource>(
  'galgame_resource',
  GalgameResourceSchema
)

export default GalgameResourceModel
