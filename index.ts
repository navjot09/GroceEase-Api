import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { PORT } from './src/utils/config'
import connectToMongo from './src/utils/db'
import auth from './src/routes/auth'
;(async function () {
  try {
    await connectToMongo()
  } catch (error) {
    console.log(error)
  }
})()

const app: Express = express()

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

app.get('/', ({ res }: { res: Response }) => {
  res.send('Hello World!')
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/auth', auth)
// app.use('/api/products', products)
