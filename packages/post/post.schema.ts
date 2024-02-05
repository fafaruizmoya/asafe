import { Static, Type } from '@sinclair/typebox'

export const postSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
})

export const postResponseSchema = Type.Composite([
  Type.Object({
    id: Type.Number(),
  }),
  postSchema,
])

export const postsResponseSchema = Type.Array(
  postResponseSchema
)

export const deletePostResponseSchema = Type.Object({})

const selectorPostSchema=Type.Object({
  id: Type.Number(),
})

export type PostInput = Static<typeof postSchema>
export type SelectorPostParams = Static<typeof selectorPostSchema>