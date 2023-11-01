import { Document, Model, SchemaTimestampsConfig } from 'mongoose'
import { Schema, model, Types } from 'mongoose'

const { ObjectId } = Schema.Types

interface IOrder {
  UserId: Types.ObjectId
  OrderDate: Date
  TotalAmount: number
  Status: 'pending' | 'completed' | 'cancelled'
  DeliveryAddress: Types.ObjectId
  Discount?: number
  ShippingCost: number
  PaymentMethod: 'cash' | 'online'
  PaymentStatus: 'pending' | 'completed'
  DeliveryDate: Date
  Notes?: string
  InvoiceNumber: string
  TrackingNumber: string
}

interface OrderDoc extends Document, IOrder, SchemaTimestampsConfig {}
interface OrderModel extends Model<OrderDoc> {
  build(attrs: IOrder): OrderDoc
}
const orderSchema = new Schema<IOrder>({
  UserId: { type: ObjectId, required: true, ref: 'User' },
  OrderDate: { type: Date, required: true },
  TotalAmount: { type: Number, required: true },
  Status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
    required: true,
  },
  DeliveryAddress: {
    type: ObjectId,
    ref: 'Address',
    required: true,
  },
  Discount: {
    type: Number,
  },
  ShippingCost: {
    type: Number,
    required: true,
  },
  PaymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'online'],
    default: 'cash',
  },
  PaymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  DeliveryDate: {
    type: Date,
    required: true,
  },
  Notes: {
    type: String,
  },
  InvoiceNumber: {
    type: String,
    required: true,
  },
  TrackingNumber: {
    type: String,
    required: true,
  },
})

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)
Order.createIndexes()
orderSchema.statics.build = (attrs: IOrder) => {
  return new Order(attrs)
}
export default Order
