import { Static, Type } from '@sinclair/typebox'

enum Role {
  ADMIN= "ADMIN",
  USER= "USER"
}

const userCore = Type.Object({
  email: Type.String({ format: 'email' }),
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
})

export const userResponseSchema = Type.Composite([
  Type.Object({
    id: Type.Number(),
  }),
  userCore,
  Type.Object({
    role: Type.Enum(Role),
    picture: Type.Optional(Type.String()),
  }),
])

export const usersResponseSchema = Type.Array(
  userResponseSchema
)

export const createUserSchema = Type.Composite([
  userCore,
  Type.Object({
    password: Type.String(),
  })
])

export const createUserResponseSchema = Type.Composite([
  Type.Object({
    id: Type.Number(),
  }),
  userCore,
])

export const updateUserSchema = Type.Composite([
  userCore,
  Type.Object({
    password: Type.Optional(Type.String()),
    role: Type.Optional(Type.Enum(Role)),
  }),
])

export const updateUserResponseSchema = Type.Composite([
  Type.Object({
    id: Type.Number(),
  }),
  userCore,
  Type.Object({
    role: Type.Optional(Type.Enum(Role)),
    picture: Type.Optional(Type.String()),
  }),
])

export const deleteUserResponseSchema = Type.Object({})

const selectorUserSchema=Type.Object({
  id: Type.Number(),
})

export type CreateUserInput = Static<typeof createUserSchema>
export type UpdateUserInput = Static<typeof updateUserSchema>
export type SelectorUserParams = Static<typeof selectorUserSchema>