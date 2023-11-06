import 'module-alias/register'
import express, { Express, Response } from 'express'
import bodyParser from 'body-parser'
import { PORT } from '@utils/config'
import connectToMongo from '@db/index'
import auth from '@routes/auth'
import Logger from '@utils/logger'
import address from '@routes/address'
;(async () => {
  await connectToMongo()
})()

const app: Express = express()

app.listen(PORT, () => Logger.debug(`Example app listening on port ${PORT}`))

app.get('/', ({ res }: { res: Response }) => {
  res.send('Hello World!')
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/auth', auth)
app.use('/api/address', address)
// app.use('/api/products', products)
