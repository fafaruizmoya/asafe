import {FastifyRequest,FastifyReply} from "fastify"
import { PostInput, SelectorPostParams } from "./post.schema"
import {prisma,STANDARD,ERROR404,ERROR401,ERROR_MESSAGES} from "@asafe/utils"

export async function createPostHandler(request:FastifyRequest<{Body: PostInput}>,reply:FastifyReply){
  const post = await prisma.post.create({
    data: <any>{ 
      ...request.body,
      userId: (request as any).user.id, 
    },
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  return reply.code(STANDARD.SUCCESS).send(post)
}

export async function getPostsHandler(request:FastifyRequest,reply:FastifyReply) {
  const userId = (request.query as any).user ?? null
  const posts= (!!userId) ? await getPostsByUser(Number(userId)) :
  await prisma.post.findMany({
    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          id: true,
        },
      },
    },
  })

  return reply.code(STANDARD.SUCCESS).send(posts)
}

async function getPostsByUser(userId: number) {
  return await prisma.post.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function updatePostHandler(request:FastifyRequest<{Params: SelectorPostParams, Body: PostInput}>,reply:FastifyReply) {
  const _id = request.params.id
  const body = request.body

  let whereFilter:any= { id: _id}
  const postCheck = await prisma.post.findUnique({ where: whereFilter })
  if (postCheck===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.postNotExists)
  }

  if((request as any).user.role!="ADMIN"){
    if (postCheck.userId!==(request as any).user.id) {
      return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.postError)
    }
    whereFilter.userId=(request as any).user.id
  }
  const { title, content } = body

  const post = await prisma.post.update({
    where: whereFilter ,
    data: { title, content },
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  return reply.code(STANDARD.SUCCESS).send(post)
}

export async function deletePostHandler(request:FastifyRequest<{Params: SelectorPostParams}>,reply:FastifyReply) {
  const _id = request.params.id

  let whereFilter:any= { id: _id}
  const postCheck = await prisma.post.findUnique({ where: whereFilter })
  if (postCheck===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.postNotExists)
  }

  if((request as any).user.role!="ADMIN"){
    if (postCheck.userId!==(request as any).user.id) {
      return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.postError)
    }
    whereFilter.userId=(request as any).user.id
  }

  await prisma.post.delete({
    where: whereFilter
  })
  
  return reply.code(STANDARD.SUCCESS).send()
}

export async function deletePostByUserHandler(request:FastifyRequest<{Params: SelectorPostParams}>,reply:FastifyReply) {
  const _id = request.params.id

  let whereFilter:any= { userId: _id}
  const postCheck = await prisma.post.findMany({ where: whereFilter })
  if (postCheck===null) {
    return reply.code(ERROR404.statusCode).send(ERROR_MESSAGES.postNotExists)
  }

  if((request as any).user.role!="ADMIN"){
    return reply.code(ERROR401.statusCode).send(ERROR_MESSAGES.postError)
  }

  await prisma.post.deleteMany({
    where: whereFilter
  })
  
  return reply.code(STANDARD.SUCCESS).send()
}