import {FastifyInstance,FastifyRequest, FastifyReply} from "fastify"
import {getUsersHandler, getUserHandler, getProfileHandler, updateProfileHandler, registerUserHandler, updateUserHandler, deleteUserHandler} from "./user.service"
import {usersResponseSchema, userResponseSchema, createUserSchema, createUserResponseSchema, updateUserSchema, updateUserResponseSchema, deleteUserResponseSchema} from "./user.schema"
import {ERROR401,ERROR_MESSAGES} from "@asafe/utils"

export async function userRoutes(server: FastifyInstance) {
  server.decorate(
    "userRoleValidation",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user
    
      const { role } = user
      if (role!="ADMIN") {
        return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.roleError)
      }
    }
  )

  server.get("", {
      schema: <any>{
        description: 'Get all users',
        tags: ['user'],
        response: {
          201: usersResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
      preValidation: [(server as any).userRoleValidation],
    },
    getUsersHandler
  )
  server.get("/:id", {
      schema: <any>{
        description: 'Get user data',
        tags: ['user'],
        params: {
          id: { type: 'number' },
        },
        response: {
          201: userResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
      preValidation: [(server as any).userRoleValidation],
    },
    getUserHandler
  )

  server.post("",
    {
      schema: <any>{
        description: 'Create a new user',
        tags: ['user'],
        body: createUserSchema,
        response: {
          201: createUserResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
      preValidation: [(server as any).userRoleValidation],
    },
    registerUserHandler
  )

  server.put("/:id", {
      schema: <any>{
        description: 'Update the user data',
        tags: ['user'],
        params: {
          id: { type: 'number' },
        },
        body: updateUserSchema,
        response: {
          201: updateUserResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
      preValidation: [(server as any).userRoleValidation],
    },
    updateUserHandler
  )

  server.delete("/:id", {
      schema: <any>{
        description: 'Delete a user',
        tags: ['user'],
        params: {
          id: { type: 'number' },
        },
        response: {
          201: deleteUserResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
      preValidation: [(server as any).userRoleValidation],
    },
    deleteUserHandler
  )

  server.get("/profile", {
      schema: <any>{
        description: 'Get a profile',
        tags: ['user'],
        response: {
          201: userResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
    },
    getProfileHandler
  )

  server.put("/profile", {
      schema: <any>{
        description: 'Update profile',
        tags: ['user'],
        body: updateUserSchema,
        response: {
          201: updateUserResponseSchema,
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
    },
    updateProfileHandler
  )
}
