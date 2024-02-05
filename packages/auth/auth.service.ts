import { FastifyReply, FastifyRequest } from "fastify"
import { LoginInput } from "./auth.schema"
import {prisma, verifyPassword, STANDARD, ERROR401,ERROR400, ERROR_MESSAGES} from "@asafe/utils"

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body

  // find a user by email
  const user = await findUserByEmail(body.email)
  if (!user) {
    return reply.code(ERROR400.statusCode).send(ERROR_MESSAGES.userNotExists)
  }

  // verify password
  const isMatch = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  })

  if (isMatch) {
    const { password, salt, ...rest } = user
    // generate access token
    reply.jwtSign({
      id:rest.id,
      email:rest.email,
    }, function (err: any, token: any) {
      if(err!==null){
        return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.tokenError)
      }
      return reply.code(STANDARD.SUCCESS).send({accessToken: token})
    })
    
  }

  return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.userCredError)
}


async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}