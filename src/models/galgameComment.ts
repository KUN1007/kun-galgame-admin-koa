import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequence'
import type { GalgameComment } from './types/galgame-comment'

const GalgameCommentSchema = new mongoose.Schema<GalgameComment>(
  {
    gcid: { type: Number, unique: true },
    gid: { type: Number, required: true },
    c_uid: { type: Number, required: true, ref: 'user' },
    to_uid: { type: Number, default: 0, ref: 'user' },
    content: { type: String, default: '', maxlength: 1007 },

    likes: { type: [Number], default: [] }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

GalgameCommentSchema.virtual('cuid', {
  ref: 'user',
  localField: 'c_uid',
  foreignField: 'uid'
})

GalgameCommentSchema.virtual('touid', {
  ref: 'user',
  localField: 'to_uid',
  foreignField: 'uid'
})

GalgameCommentSchema.pre('save', increasingSequence('gcid'))

const GalgameCommentModel = mongoose.model<GalgameComment>(
  'galgame_comment',
  GalgameCommentSchema
)

export default GalgameCommentModel
