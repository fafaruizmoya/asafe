import {FastifyInstance} from "fastify"
import fp from "fastify-plugin"
import {postRoutes} from "./post.route"

export function asafePost (server: FastifyInstance, options: any, done: any) {
  server.register(postRoutes, {prefix:'api/posts'})

  done()
}

export default fp(asafePost, {
  fastify: '4.x',
  name: '@asafe/post'
})
