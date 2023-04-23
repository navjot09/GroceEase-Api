import express from 'express'
import { PORT } from './config.js'
import connectToMongo from './db.js'

await connectToMongo()

const app = express()

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

app.get('/', ({ res }) => {
  res.send('Hello World bye!')
})
