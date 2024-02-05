import buildServer from "@asafe/api"
import dotenv from 'dotenv'
dotenv.config()

const server = buildServer()
const port = Number(process.env.PORT) || 8080

server.listen({port: port, host: '0.0.0.0'}, (err: any, address: any) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})