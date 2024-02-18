import bcrypt from 'bcrypt'
import { verifyJWTPayload, generateToken } from '@/utils/jwt'
import { setValue, getValue } from '@/config/redisConfig'
import UserModel from '@/models/user'

class AuthService {
  async generateTokens(uid: number, name: string) {
    const token = generateToken(uid, name, '60m')
    const refreshToken = generateToken(uid, name, '7d')

    await setValue(`refreshToken:${uid}`, refreshToken, 7 * 24 * 60 * 60)

    return { token, refreshToken }
  }

  async generateTokenByRefreshToken(refreshToken: string) {
    const decoded = verifyJWTPayload(refreshToken)

    if (!decoded) {
      return null
    }

    if (
      !decoded.uid ||
      decoded.iss !== 'kungalgame' ||
      decoded.aud !== 'kungalgamer'
    ) {
      return null
    }

    const accessToken = generateToken(decoded.uid, decoded.name, '60m')

    return accessToken
  }

  async verifyVerificationCode(
    email: string,
    userProvidedCode: string
  ): Promise<boolean> {
    const storedCode = await getValue(email)

    if (!storedCode) {
      return false
    }

    return userProvidedCode === storedCode
  }

  async resetPasswordByEmail(email: string, code: string, newPassword: string) {
    const validEmail = this.verifyVerificationCode(email, code)

    if (!validEmail) {
      return 10103
    }

    const hashedPassword = await bcrypt.hash(newPassword, 7)

    const user = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } }
    )

    if (!user) {
      return 10101
    }
  }
}

export default new AuthService()
