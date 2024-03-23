import TagModel from '@/models/tag'
import mongoose from '@/db/connection'

class TagService {
  async createTagsByTidAndRid (tid: number, rid: number, tagNames: string[], category: string[]) {
    try {
      const tagsArray = Array.isArray(tagNames) ? tagNames : JSON.parse(tagNames)
      const uniqueTagNames = [...new Set(tagsArray)]
      const createdTags = []

      for (const tagName of uniqueTagNames) {
        const newTag = new TagModel({ name: tagName, tid, rid, category })
        const savedTag = await newTag.save()
        createdTags.push(savedTag)
      }

      return createdTags
    } catch (error) {
      console.error('Failed to create tags:', error)
      throw error
    }
  }

  async updateTagsByTidAndRid (tid: number, rid: number, tags: string[], category: string[]) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const tagsArray = tags

      const existingTags = await TagModel.find({ tid, rid })
      const existingTagNames = existingTags.map((tag) => tag.name)

      const tagsToAdd = tagsArray.filter((tag) => !existingTagNames.includes(tag))

      const tagsToRemove = existingTagNames.filter((tag) => !tagsArray.includes(tag))

      await this.createTagsByTidAndRid(tid, rid, tagsToAdd, category)

      for (const tagToRemove of tagsToRemove) {
        await TagModel.deleteOne({ tid, rid, name: tagToRemove })
      }

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }

  async deleteTagsByTidAndRid (tid: number, rid: number) {
    await TagModel.deleteMany({ tid, rid })
  }

  async getTopTags (limit: number) {
    const topTags = await TagModel.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ])

    const topTagNames = topTags.map((tag) => tag._id)

    return topTagNames
  }
}

export default new TagService()
