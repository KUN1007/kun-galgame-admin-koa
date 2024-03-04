import schedule from 'node-schedule'

import UserModel from '@/models/user'

const resetDailyTask = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await UserModel.updateMany(
      {},
      {
        $set: {
          daily_topic_count: 0,
          daily_image_count: 0,
          daily_check_in: 0,
        },
      }
    )
    console.log('Reset successfully!')
  } catch (error) {
    console.error('Reset ERROR: ', error)
  }
})

export const useKUNGalgameTask = () => {
  resetDailyTask
}
