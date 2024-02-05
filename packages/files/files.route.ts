import {FastifyInstance} from "fastify"
import {uploadFileHandler} from "./files.service"

export async function filesRoutes(server: FastifyInstance) {
  server.post("/upload",
    {
      schema: <any>{
        description: 'Upload a profile picture',
        tags: ['user'],
        response: {
          201: {
            type: "object",
            properties: {
              picture :{ type: "string" }
            },
          },
        },
        security: [
          {
            "bearerAuth": []
          }
        ],
      },
    },
    uploadFileHandler
  )
}
