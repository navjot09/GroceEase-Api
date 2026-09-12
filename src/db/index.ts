import { connect } from 'mongoose'
import { MONGODB_URI } from '@utils/config'
import Logger from '@utils/logger'
import Cart from '@models/cart.model'
import CartItem from '@models/cartItem.model'

async function connectToMongo() {
  if (!MONGODB_URI) {
    throw new Error('Invalid MONGODB_URI')
  }
  await connect(MONGODB_URI)
  Logger.debug('Connected to MongoDB')

  // Build the cart indexes explicitly and await them, so a failure is loud.
  // These used to be floating `Model.createIndexes()` calls at module load:
  // unawaited, uncaught, and building nothing because no field declared an index.
  try {
    await Promise.all([Cart.createIndexes(), CartItem.createIndexes()])
    Logger.debug('Cart indexes ready')
  } catch (error) {
    Logger.error(
      'Cart index build failed — cart queries would run unindexed. ' +
        'If this is a duplicate-key error, run scripts/migrate-cart-indexes.js first.',
    )
    throw error
  }
}

export default connectToMongo
