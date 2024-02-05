import {FastifyRequest,FastifyReply} from "fastify"
import { CreateUserInput, UpdateUserInput, SelectorUserParams } from "./user.schema"
import {prisma,encodePassword,STANDARD,ERROR401,ERROR404,ERROR409,ERROR_MESSAGES} from "@asafe/utils"

export async function registerUserHandler(request:FastifyRequest<{Body: CreateUserInput}>,reply:FastifyReply){
  const body = request.body

  const userCheck = await prisma.user.findUnique({ where: { email: body.email } })
  if (userCheck) {
    return reply.code(ERROR409.statusCode).send(ERROR_MESSAGES.userExists)
  }

  const { password, ...rest } = body

  const { hash, salt } = encodePassword(password)

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      role: true,
      picture: true,
    },
  })
  
  return reply.code(STANDARD.SUCCESS).send(user)
}

export async function getUsersHandler(request:FastifyRequest,reply:FastifyReply) {
  const users= await prisma.user.findMany({
    orderBy: {
      id: 'asc',
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      role: true,
      picture: true,
    },
  })
  return reply.code(STANDARD.SUCCESS).send(users)
}

export async function getUserHandler(request:FastifyRequest<{Params: SelectorUserParams}>,reply:FastifyReply) {
  const user= await getUser(request.params.id)
  if (user===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.userNotExists)
  }
  return reply.code(STANDARD.SUCCESS).send(user)
}

export async function updateUserHandler(request:FastifyRequest<{Params: SelectorUserParams, Body: UpdateUserInput}>,reply:FastifyReply) {
  const user= await updateUser(request.params.id, request.body)
  
  if (user===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.userNotExists)
  }
  return reply.code(STANDARD.SUCCESS).send(user)
}

export async function deleteUserHandler(request:FastifyRequest<{Params: SelectorUserParams}>,reply:FastifyReply) {
  const _id = request.params.id
  const userId = (request as any).user.id
  if(_id < 3 || _id == userId){
    return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.roleError)
  }

  const userCheck = await prisma.user.findUnique({ where: { id: _id } })
  if (userCheck===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.userNotExists)
  }

  await prisma.user.delete({
    where: { id: _id }
  })
  
  return reply.code(STANDARD.SUCCESS).send()
}

export async function getProfileHandler(request:FastifyRequest<{Params: SelectorUserParams}>,reply:FastifyReply) {
  const userId = (request as any).user.id
  const user= await getUser(userId)
  if (user===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.userNotExists)
  }
  return reply.code(STANDARD.SUCCESS).send(user)
}

export async function updateProfileHandler(request:FastifyRequest<{Body: UpdateUserInput}>,reply:FastifyReply) {
  const userId = (request as any).user.id
  const { role, ...rest } = request.body
  const user= await updateUser(userId, rest)
  
  if (user===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.userNotExists)
  }
  return reply.code(STANDARD.SUCCESS).send(user)
}

async function getUser(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      role: true,
      picture: true,
    },
  })
}

async function updateUser(userId: number, body: UpdateUserInput) {
  const { email, password, ...rest } = body
  let dataUpdate:any = { ...rest}
  if(userId > 2 && !!password){
    const { hash, salt } = encodePassword(password)
    dataUpdate={ ...rest, salt, password: hash }
  }

  return await prisma.user.update({
    where: { id: userId } ,
    data: dataUpdate,
    select: {
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      role: true,
      picture: true,
    },
  })
}