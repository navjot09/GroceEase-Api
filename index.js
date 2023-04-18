import express from 'express'
import * as dotenv from 'dotenv'
// eslint-disable-next-line import/extensions
import connectToMongo from './db.js'

dotenv.config()

await connectToMongo()

const app = express()
const { PORT } = process.env

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

app.get('/', ({ res }) => {
  res.send('Hello World bye!')
})
