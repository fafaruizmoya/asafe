import {FastifyRequest,FastifyReply} from "fastify"
import {prisma,STANDARD,ERROR400} from "@asafe/utils"
import { S3Client,PutObjectCommand } from '@aws-sdk/client-s3'

export async function uploadFileHandler(request:FastifyRequest,reply:FastifyReply){
  const data = await request.file()
  if(data===undefined)
    return reply.code(ERROR400.statusCode).send(ERROR400.message)

  const client = new S3Client({
    region: process.env.AWS_REGION
  })

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET, 
    Key: (request as any).user.id+'_'+data.filename,
    Body: await data.toBuffer(),
    ContentType: data.mimetype,
    ACL: "public-read"
  })

  await client.send(putObjectCommand)

  const picture = await prisma.user.update({
    where: { id: (request as any).user.id } ,
    data: {
      picture:"https://"+process.env.AWS_BUCKET+".s3."+process.env.AWS_REGION+".amazonaws.com/"+(request as any).user.id+'_'+data.filename
    },
    select: {
      picture: true,
    },
  })

  return reply.code(STANDARD.SUCCESS).send(picture)
}