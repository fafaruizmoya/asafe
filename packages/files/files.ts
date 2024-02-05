import {FastifyInstance} from "fastify"
import fp from "fastify-plugin"
import multipart from "@fastify/multipart"
import {filesRoutes} from "./files.route"

export function asafeFiles (server: FastifyInstance, options: any, done: any) {
  server.register(multipart, {
    limits: {
      fileSize: 1000000,
      files: 1,
    },
  })
  server.register(filesRoutes, {prefix:'api/files'})

  done()
}

export default fp(asafeFiles, {
  fastify: '4.x',
  name: '@asafe/files'
})
