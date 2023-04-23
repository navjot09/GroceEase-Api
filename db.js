import { connect } from 'mongoose'
import { MONGODB_URI } from './config.js'

async function connectToMongo() {
  try {
    await connect(MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error(error)
  }
}

export default connectToMongo
