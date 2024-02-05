import {FastifyInstance} from "fastify"
import {loginHandler} from "./auth.service"
import {loginSchema, loginResponseSchema} from "./auth.schema"

export async function authRoutes(server: FastifyInstance) {
  
  server.post("",
    {
      schema: <any>{
        description: 'Login with email and password',
        tags: ['user'],
        body: loginSchema,
        response: {
          201: loginResponseSchema,
        },
      },
      config:<any>{
        isPublic: true
      }
    },
    loginHandler
  )

}
