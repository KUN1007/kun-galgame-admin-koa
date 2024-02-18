import schedule from 'node-schedule'

import UserModel from '@/models/user'

const resetDailyTopicCountTask = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await UserModel.updateMany({}, { $set: { daily_topic_count: 0 } })
    console.log('Reset user daily_topic_count successfully!')
  } catch (error) {
    console.error('Reset user daily_topic_count ERROR: ', error)
  }
})

const resetDailyImageCountTask = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await UserModel.updateMany({}, { $set: { daily_image_count: 0 } })
    console.log('Reset user daily_image_count successfully!')
  } catch (error) {
    console.error('Reset user daily_image_count ERROR: ', error)
  }
})

const resetUserDailyCheckInTask = schedule.scheduleJob(
  '0 0 * * *',
  async () => {
    try {
      await UserModel.updateMany({}, { $set: { daily_check_in: 0 } })
      console.log('Reset user daily_check_in successfully!')
    } catch (error) {
      console.error('Reset user daily_check_in ERROR: ', error)
    }
  }
)

export const useKUNGalgameTask = () => {
  resetDailyTopicCountTask
  resetDailyImageCountTask
  resetUserDailyCheckInTask
}
