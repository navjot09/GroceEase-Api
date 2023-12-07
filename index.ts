import 'module-alias/register'
import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { PORT } from '@utils/config'
import connectToMongo from '@db/index'
import auth from '@routes/auth'
import Logger from '@utils/logger'
import cors from 'cors'
import address from '@routes/address'
import category from '@routes/category'
import product from '@routes/product'
;(async () => {
  await connectToMongo()
})()

const app: Express = express()

app.listen(PORT, () => Logger.debug(`Example app listening on port ${PORT}`))
const timer = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors<Request>())

app.get('/', async ({ res }: { res: Response }) => {
  console.log('start')
  await timer(1000)
  console.log('end')
  res.json({ name: 'Navjot' })
})

app.get('/x', async ({ res }: { res: Response }) => {
  console.log('start')
  await timer(1000)
  console.log('end')
  res.json({ name: 'Navjot' })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/auth', auth)
app.use('/api/address', address)
app.use('/api/categories', category)
app.use('/api/products', product)
