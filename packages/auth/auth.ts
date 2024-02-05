import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify"
import fp from "fastify-plugin"
import jwt from "@fastify/jwt"
import {authRoutes} from "./auth.route"
import {prisma,ERROR401,ERROR403,ERROR_MESSAGES} from "@asafe/utils"

export function asafeAuth (server: FastifyInstance, options: any, done: any) {
  server.register(authRoutes, {prefix:'api/login'})

  server.register(jwt, {secret: String(process.env.API_JWT_SECRET)})
  //server.decorateRequest('user', '')

  server.addHook("onRequest", async function(request:FastifyRequest,reply:FastifyReply) {
    const {isPublic} = request.routeOptions.config as any;
    if(
      (isPublic &&
      request.routeOptions.config.url=='/api/login' &&
      request.routeOptions.config.method=='POST') || request.routeOptions.config.url.substring(0,14)=='/documentation')
      return 

    await request.jwtVerify().then(async (decoded:any)=>{
          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
              email: true,
              firstName: true,
              lastName: true,
              id: true,
              role: true,
            }
          })

          if (!user) {
            return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.invalidToken)
          }
          request.user = user
        }
      ).catch ((err) => reply.code(ERROR403.statusCode).send(err))
  })

  done()
}

export default fp(asafeAuth, {
  fastify: '4.x',
  name: '@asafe/auth'
})