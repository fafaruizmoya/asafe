import {FastifyInstance} from "fastify"
import {createPostHandler, getPostsHandler, updatePostHandler, deletePostHandler, deletePostByUserHandler} from "./post.service"
import {postSchema, postsResponseSchema, postResponseSchema, deletePostResponseSchema} from "./post.schema"

export async function postRoutes(server: FastifyInstance) {
  server.get("", {
    schema: <any>{
      description: 'Get all posts',
      tags: ['post'],
      querystring:{
        user: { type: 'number' },
      },
      response: {
        201: postsResponseSchema,
      },
      security: [
        {
          "bearerAuth": []
        }
      ],
    },
  },
    getPostsHandler
  )

  server.post("",
    {
      schema: <any>{
        description: 'Create a new post',
        tags: ['post'],
        body: postSchema,
        response: {
          201: postResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
    },
    createPostHandler
  )

  server.put("/:id", {
      schema: <any>{
        description: 'Update a post data',
        tags: ['post'],
        params: {
          id: { type: 'number' },
        },
        body: postSchema,
        response: {
          201: postResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
    },
    updatePostHandler
  )

  server.delete("/:id", {
      schema: <any>{
        description: 'Delete a post',
        tags: ['post'],
        params: {
          id: { type: 'number' },
        },
        response: {
          201: deletePostResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
    },
    deletePostHandler
  )

  server.delete("/user/:id", {
      schema: <any>{
        description: 'Delete all post from a user',
        tags: ['post'],
        params: {
          id: { type: 'number' },
        },
        response: {
          201: deletePostResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
    },
    deletePostByUserHandler
  )
}
