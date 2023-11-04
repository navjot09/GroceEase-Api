import { connect } from 'mongoose'
import { MONGODB_URI } from '@utils/config'
import Logger from '@utils/logger'

async function connectToMongo() {
  try {
    if (MONGODB_URI) {
      await connect(MONGODB_URI)
      Logger.debug('Connected to MongoDB')
    } else {
      throw new Error('Invalid MONGODB_URI')
    }
  } catch (error) {
    Logger.error(error)
  }
}

export default connectToMongo
