export const checkTopicPublish = (
  title: string,
  content: string,
  tags: string[],
  category: string[]
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

  if (!category.length || category.length > 2) {
    return 10204
  }

  return 0
}
