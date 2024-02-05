import { Static, Type } from '@sinclair/typebox'

export const loginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
})

export const loginResponseSchema = Type.Object({
  accessToken: Type.String(),
})

export type LoginInput = Static<typeof loginSchema>