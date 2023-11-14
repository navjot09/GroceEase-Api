import { Schema, model, Types, Model, SchemaTimestampsConfig, Document } from 'mongoose'

const { ObjectId } = Schema.Types
interface IOrderItem {
  OrderId: Types.ObjectId
  Quantity: number
  ProductId: Types.ObjectId
}
interface OrderItemDoc extends Document, IOrderItem, SchemaTimestampsConfig {}

interface OrderItemModel extends Model<OrderItemDoc> {
  build(attrs: IOrderItem): OrderItemDoc
}
const orderItemSchema = new Schema<IOrderItem>({
  OrderId: {
    type: ObjectId,
    ref: 'Order',
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  ProductId: {
    type: ObjectId,
    ref: 'Product',
    required: true,
  },
})
orderItemSchema.statics.build = (attrs: IOrderItem) => new OrderItem(attrs)
const OrderItem = model<OrderItemDoc, OrderItemModel>('OrderItem', orderItemSchema)
OrderItem.createIndexes()

export default OrderItem
