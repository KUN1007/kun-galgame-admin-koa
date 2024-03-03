import jwt from 'jsonwebtoken'
import env from '@/config/config.dev'
import { setValue } from '@/config/redisConfig'

interface Payload {
  iss: string
  aud: string
  uid: number
  name: string
}

export function verifyJWTPayloadByHeader(authHeader: string) {
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as Payload
    return payload
  } catch (error) {
    return null
  }
}

export function verifyJWTPayload(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as Payload
    return payload
  } catch (error) {
    return null
  }
}

export function generateToken(uid: number, name: string, expire: string) {
  const payload: Payload = { iss: env.JWT_ISS, aud: env.JWT_AUD, uid, name }
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: expire })
  return token
}

export const generateLoginToken = async (uid: number, name: string) => {
  const token = generateToken(uid, name, '7d')
  await setValue(`adminToken:${uid}`, token, 7 * 24 * 60 * 60)
  return token
}
