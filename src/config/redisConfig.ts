import Redis from 'ioredis'
import env from '@/config/config.dev'

const redisClient = new Redis({
  port: parseInt(env.REDIS_PORT),
  host: env.REDIS_HOST,
})

redisClient.on('connect', () => {
  console.log(
    `redis: ${env.REDIS_HOST}:${env.REDIS_PORT} connection successful! `
  )
})

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error)
})

const setValue = async (key: string, value: string, time?: number) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }

  try {
    if (time) {
      await redisClient.setex(key, time, value)
    } else {
      await redisClient.set(key, value)
    }
  } catch (error) {
    console.error('Error setting value in Redis:', error)
  }
}

const getValue = async (key: string) => {
  try {
    const value = await redisClient.get(key)
    return value
  } catch (error) {
    console.error('Error getting value from Redis:', error)
    return null
  }
}

const delValue = async (key: string) => {
  try {
    await redisClient.del(key)
  } catch (error) {
    console.error('Error deleting value from Redis:', error)
  }
}

export { redisClient, setValue, getValue, delValue }
