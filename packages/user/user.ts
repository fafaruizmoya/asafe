import {FastifyInstance} from "fastify"
import fp from "fastify-plugin"
import {userRoutes} from "./user.route"

export function asafeUser (server: FastifyInstance, options: any, done: any) {
  server.register(userRoutes, {prefix:'api/users'})

  done()
}

export default fp(asafeUser, {
  fastify: '4.x',
  name: '@asafe/user'
})
