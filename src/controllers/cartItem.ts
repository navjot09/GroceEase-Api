import Cart from '@models/cart.model'
import CartItem from '@models/cartItem.model'
import Product from '@models/product.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'
import { Types } from 'mongoose'

const invalidId = (res: Response) => {
  res.status(400).json({ success: false, title: 'Bad Request', message: 'Invalid product id' })
}

export const getProductQuantity = asynchHandler(
  async (req: Request<{ productId: string }>, res: Response) => {
    const { productId } = req.params
    if (!Types.ObjectId.isValid(productId)) {
      invalidId(res)
      return
    }
    const productObjId = new Types.ObjectId(productId)

    const [cart, productExists] = await Promise.all([
      Cart.findOne({ UserId: res.locals.id }).select('_id').lean(),
      Product.exists({ _id: productObjId }),
    ])
    if (!cart) {
      res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
      return
    }
    if (!productExists) {
      res.status(404).json({ success: false, title: 'Not Found', message: 'Product not found' })
      return
    }
    const cartItem = await CartItem.findOne({ CartId: cart._id, ProductId: productObjId })
      .select('Quantity')
      .lean()
    res.status(200).json({ success: true, count: cartItem?.Quantity ?? 0 })
  },
)

export const add = asynchHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const { productId } = req.params
  if (!Types.ObjectId.isValid(productId)) {
    invalidId(res)
    return
  }
  const productObjId = new Types.ObjectId(productId)

  // The cart lookup and the product existence check are independent — run them
  // concurrently instead of paying two serial round trips. `exists` returns an
  // _id-only projection rather than hydrating the whole product document, whose
  // only previous use was to re-derive the id we already have.
  const [cart, productExists] = await Promise.all([
    Cart.findOne({ UserId: res.locals.id }).select('_id').lean(),
    Product.exists({ _id: productObjId }),
  ])
  if (!cart) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
    return
  }
  if (!productExists) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Product not found' })
    return
  }

  const filter = { CartId: cart._id, ProductId: productObjId }
  const update = { $inc: { Quantity: 1 } }
  try {
    await CartItem.findOneAndUpdate(filter, update, { upsert: true })
  } catch (error) {
    // Two concurrent adds for the same product can both miss and both try to
    // insert; the unique index makes the loser fail with E11000 instead of
    // silently creating a duplicate row. The row exists by now, so one retry
    // takes the $inc path and succeeds.
    if ((error as { code?: number })?.code !== 11000) throw error
    await CartItem.findOneAndUpdate(filter, update, { upsert: true })
  }
  return res.status(204).send()
})

export const remove = asynchHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const { productId } = req.params
  if (!Types.ObjectId.isValid(productId)) {
    invalidId(res)
    return
  }
  const productObjId = new Types.ObjectId(productId)

  const cart = await Cart.findOne({ UserId: res.locals.id }).select('_id').lean()
  if (!cart) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
    return
  }

  // Decrement atomically when Quantity > 1, otherwise drop the row. The previous
  // read-then-write pair could interleave two concurrent decrements and drive
  // Quantity below zero. The product lookup is gone: it was never referenced,
  // and it made a cart line unremovable once its product left the catalogue.
  const decremented = await CartItem.findOneAndUpdate(
    { CartId: cart._id, ProductId: productObjId, Quantity: { $gt: 1 } },
    { $inc: { Quantity: -1 } },
  )
  if (!decremented) {
    const deleted = await CartItem.findOneAndDelete({
      CartId: cart._id,
      ProductId: productObjId,
    })
    if (!deleted) {
      res.status(404).json({ success: false, title: 'Not Found', message: 'Product not in Cart' })
      return
    }
  }
  return res.status(204).send()
})
