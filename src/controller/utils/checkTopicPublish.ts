const topicCategory = ['Galgame', 'Technique', 'Others']

export const checkTopicPublish = (
  title: string,
  content: string,
  tags: string[],
  category: string[],
  section: string[]
) => {
  if (!title.trim() || title.trim().length > 40) {
    return 10201
  }

  if (!content.trim() || content.trim().length > 100007) {
    return 10202
  }

  if (!tags.length || tags.length > 7) {
    return 10203
  }

  for (const tag of tags) {
    if (tag.length > 17) {
      return 10502
    }
  }

  if (!category.length || category.length > 2) {
    return 10204
  }

  for (const c of category) {
    if (!topicCategory.includes(c)) {
      return 10206
    }
  }

  if (!section.length || section.length > 2) {
    return 10207
  }

  return 0
}
