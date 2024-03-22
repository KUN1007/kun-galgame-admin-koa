import type { Payload } from './payload'

declare module 'koa' {
  interface Context {
    state: {
      user: Payload
    }
  }
}
