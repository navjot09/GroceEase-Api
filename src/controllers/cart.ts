import Cart from '@models/cart.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'

export const getCartItems = asynchHandler(async (req: Request, res: Response) => {
  const cartItems = await Cart.aggregate()
    .match({ UserId: res.locals.id })
    .lookup({
      from: 'cartitems',
      localField: '_id',
      foreignField: 'CartId',
      as: 'CartItems',
    })
    .project({ items: '$CartItems' })

  if (!cartItems?.[0]) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
    return
  }
  res.status(200).json({ success: true, data: cartItems[0].items })
})

export const getItinerary = asynchHandler(async (req: Request, res: Response) => {
  const cart: any = await Cart.aggregate().match({ UserId: res.locals.id }).lookup({
    from: 'cartitems',
    localField: '_id',
    foreignField: 'CartId',
    as: 'CartItems',
  })
  if (!cart?.[0]?.CartItems?.length) {
    res.status(204).json({ success: true, title: 'Cart Empty', message: 'Cart is Empty' })
    return
  }
  const itinerary = await Cart.aggregate()
    .match({ UserId: res.locals.id })
    .lookup({
      from: 'cartitems',
      localField: '_id',
      foreignField: 'CartId',
      as: 'CartItems',
    })
    .unwind({ path: '$CartItems' })
    .lookup({
      from: 'products',
      localField: 'CartItems.ProductId',
      foreignField: '_id',
      as: 'CartItems.ProductDetails',
    })
    .unwind({ path: '$CartItems.ProductDetails' })
    .group({
      _id: '$_id',
      CartItems: {
        $push: {
          $mergeObjects: [
            '$CartItems',
            {
              TotalPrice: { $multiply: ['$CartItems.ProductDetails.Price', '$CartItems.Quantity'] },
            },
            {
              TotalDiscountedPrice: {
                $multiply: ['$CartItems.ProductDetails.DiscountPrice', '$CartItems.Quantity'],
              },
            },
            {
              NetPrice: {
                $ifNull: [
                  { $multiply: ['$CartItems.ProductDetails.DiscountPrice', '$CartItems.Quantity'] },
                  { $multiply: ['$CartItems.ProductDetails.Price', '$CartItems.Quantity'] },
                ],
              },
            },
          ],
        },
      },
    })
    .addFields({
      TotalPrice: {
        $sum: '$CartItems.TotalPrice',
      },
      TotalDiscountedPrice: {
        $sum: '$CartItems.TotalDiscountedPrice',
      },
      TotalNetPrice: {
        $sum: '$CartItems.NetPrice',
      },
    })
    .addFields({
      Saving: {
        $subtract: ['$TotalPrice', '$TotalNetPrice'],
      },
    })
  if (!itinerary?.[0]) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Cart not found' })
    return
  }
  return res.status(200).json({ success: true, data: itinerary[0] })
})
