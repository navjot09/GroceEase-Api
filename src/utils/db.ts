import { connect } from 'mongoose'
import { MONGODB_URI } from './config'

async function connectToMongo() {
  try {
    if (MONGODB_URI) {
      await connect(MONGODB_URI)
      console.log('Connected to MongoDB')
    } else {
      throw new Error('Invalid MONGODB_URI')
    }
  } catch (error) {
    console.error(error)
  }
}

export default connectToMongo
