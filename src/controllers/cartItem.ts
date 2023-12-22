import Cart from '@models/cart.model'
import CartItem from '@models/cartItem.model'
import Product from '@models/product.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'
import { Types } from 'mongoose'

export const getProductQuantity = asynchHandler(
  async (req: Request<{ productId: string }>, res: Response) => {
    const { productId } = req.params
    const productObjId = new Types.ObjectId(productId)
    const cart = await Cart.findOne({ UserId: res.locals.id })
    if (!cart) {
      res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
      return
    }
    const product = await Product.findById(productObjId)
    if (!product) {
      res.status(404).json({ success: false, title: 'Not Found', message: 'Product not found' })
      return
    }
    const cartItem = await CartItem.findOne({ CartId: cart._id, ProductId: product._id })
    res.status(200).json({ success: true, count: cartItem?.Quantity ?? 0 })
  },
)

export const add = asynchHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const { productId } = req.params
  const productObjId = new Types.ObjectId(productId)
  const cart = await Cart.findOne({ UserId: res.locals.id })
  if (!cart) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
    return
  }
  const product = await Product.findById(productObjId)
  if (!product) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Product not found' })
    return
  }
  const filter = { CartId: cart._id, ProductId: product._id }
  const update = { $inc: { Quantity: 1 } }
  const options = { upsert: true, new: true }

  await CartItem.findOneAndUpdate(filter, update, options)
  return res.status(204).send()
})

export const remove = asynchHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const { productId } = req.params
  const productObjId = new Types.ObjectId(productId)
  const cart = await Cart.findOne({ UserId: res.locals.id })
  if (!cart) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
    return
  }
  const product = await Product.findById(productObjId)
  if (!product) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Product not found' })
    return
  }
  const item = await CartItem.findOne({ CartId: cart._id, ProductId: productObjId })
  if (!item) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Product not in Cart' })
    return
  }
  if (item.Quantity > 1) {
    await CartItem.findByIdAndUpdate(item._id, { $inc: { Quantity: -1 } })
  } else {
    await CartItem.findByIdAndDelete(item._id)
  }
  return res.status(204).send()
})
