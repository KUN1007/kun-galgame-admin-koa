import mongoose from 'mongoose'
import env from '@/config/config.dev'

// const DB_URL = `mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_HOSTNAME}:${env.MONGO_PORT}/${env.DB_NAME}`
const DB_URL = `mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}`

// eslint-disable-next-line @typescript-eslint/no-floating-promises
mongoose.connect(DB_URL)

mongoose.connection.on('connected', () => {
  console.log(`MongoDB: ${DB_URL} connection successful! `)
})

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

export default mongoose
