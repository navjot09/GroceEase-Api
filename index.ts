import 'module-alias/register'
import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import connectToMongo from '@db/index'
import auth from '@routes/auth'
import Logger from '@utils/logger'
import cors from 'cors'
import address from '@routes/address'
import category from '@routes/category'
import product from '@routes/product'
import { PORT } from '@utils/config'
;(async () => {
  await connectToMongo()
})()

const app: Express = express()

app.listen(PORT, () => Logger.debug(`Example app listening on port ${PORT}`))

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors<Request>())

app.get('/', ({ res }: { res: Response }) => {
  res.send('hello world')
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/auth', auth)
app.use('/api/address', address)
app.use('/api/categories', category)
app.use('/api/products', product)
