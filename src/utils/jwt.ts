import jwt from 'jsonwebtoken'
import env from '@/config/config.dev'

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
