import { MongoClient, ServerApiVersion } from 'mongodb'
import { MONGODB_URI } from './config.js'

const uri = MONGODB_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function connectToMongo() {
  try {
    await client.connect()
    await client.db('groceEase').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } catch (error) {
    console.log(error)
  }
}

export default connectToMongo