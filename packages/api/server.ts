import Fastify,{FastifyServerOptions} from "fastify"
import cors from "@fastify/cors"
import swagger from "@fastify/swagger"
import swaggerUI from "@fastify/swagger-ui"
import asafeAuth from "@asafe/auth"
import asafeUser from "@asafe/user"
import asafePost from "@asafe/post"
import asafeFiles from "@asafe/files"

export default function buildServer(isTesting?:boolean) {
  const server = Fastify()

  server.register(cors)

  if(!isTesting){
    server.register(
      swagger,
      {
        openapi: {
          info: {
            title: 'a-safe API',
            description: 'API for manage users and posts',
            version: '1.0.0'
          },
          servers: [
            {
              url: String(process.env.DOMAIN)
            }
          ],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
              }
            }
          },
          tags: [
            { name: 'user', description: 'User related end-points' },
            { name: 'post', description: 'Post related end-points' }
          ]
        }
      }
    )
    
    server.register(swaggerUI, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      },
      uiHooks: {
        onRequest: function (_request:any, _reply:any, next:any) {
          next()
        },
        preHandler: function (_request:any, _reply:any, next:any) {
          next()
        }
      },
      staticCSP: true,
      transformStaticCSP: (header:any) => header,
      transformSpecification: (swaggerObject:any) => {
        return swaggerObject
      },
      transformSpecificationClone: true
    })
  }

  server.register(asafeAuth)
  server.register(asafeUser)
  server.register(asafePost)
  server.register(asafeFiles)
 
  return server
}
