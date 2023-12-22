import Cart from '@models/cart.model'
import CartItem, { ICartItem } from '@models/cartItem.model'
import Order from '@models/order.model'
import OrderItem from '@models/orderItems.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'
import { Types } from 'mongoose'

export const postOrder = asynchHandler(
  async (
    req: Request<
      object,
      object,
      {
        note?: string
        deliveryAddress: string
        paymentMethod: 'cash' | 'online'
        paymentStatus: 'pending' | 'completed'
        totalAmount: number
      }
    >,
    res: Response,
  ) => {
    const { note, deliveryAddress, paymentMethod, paymentStatus, totalAmount } = req.body
    const cart = await Cart.aggregate().match({ UserId: res.locals.id }).lookup({
      from: 'cartitems',
      localField: '_id',
      foreignField: 'CartId',
      as: 'CartItems',
    })
    if (!cart?.[0]?.CartItems?.length) {
      res.status(404).json({ success: false, title: 'Cart Empty', message: 'Cart is Empty' })
      return
    }
    const order = Order.build({
      UserId: res.locals.id,
      OrderDate: new Date(),
      TotalAmount: totalAmount,
      Status: 'pending',
      DeliveryAddress: new Types.ObjectId(deliveryAddress),
      PaymentMethod: paymentMethod,
      PaymentStatus: paymentStatus,
      DeliveryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      Notes: note,
      InvoiceNumber: '123',
      TrackingNumber: '123',
    })
    await order.save()
    const cartItems = cart[0].CartItems as ICartItem[]
    const orderItems = cartItems.map((item) => ({
      OrderId: order._id,
      ProductId: item.ProductId,
      Quantity: item.Quantity,
    }))
    await OrderItem.insertMany(orderItems)
    await CartItem.deleteMany({ CartId: cart[0]._id })
    res
      .status(201)
      .json({ success: true, title: 'Order Placed', message: 'Order Placed Successfully' })
  },
)

export const getOrders = asynchHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ UserId: res.locals.id })
  res.status(200).json({ success: true, data: orders })
})

export const getOrderDetails = asynchHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const order = await Order.findOne({ _id: req.params.id })
    if (!order) {
      res.status(404).json({ success: false, title: 'Not Found', message: 'Order not found' })
      return
    }
    if (order?.UserId?.equals(res.locals.id)) {
      const orderDetails = await Order.aggregate()
        .match({ _id: order._id })
        .lookup({
          from: 'orderitems',
          localField: '_id',
          foreignField: 'OrderId',
          as: 'OrderItems',
        })
        .unwind({ path: '$OrderItems' })
        .lookup({
          from: 'products',
          localField: 'OrderItems.ProductId',
          foreignField: '_id',
          as: 'Product',
        })
        .unwind({ path: '$Product' })
        .group({
          _id: '$_id',
          OrderItems: {
            $push: {
              Order: '$OrderItems',
              Product: '$Product',
            },
          },
        })
        .lookup({
          from: 'orders',
          localField: '_id',
          foreignField: '_id',
          as: 'OrderDetails',
        })
        .unwind({ path: '$OrderDetails' })
        .lookup({
          from: 'addresses',
          localField: 'OrderDetails.DeliveryAddress',
          foreignField: '_id',
          as: 'DeliveryAddressDetails',
        })
        .unwind({ path: '$DeliveryAddressDetails' })
        .exec()
      res.status(200).json({ success: true, data: orderDetails[0] })
      return
    }
    res
      .status(401)
      .json({ success: false, title: 'Unauthorized', message: "Order doesn't belongs to user" })
  },
)
