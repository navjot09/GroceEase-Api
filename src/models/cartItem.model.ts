import { Schema, model, Types, Model, SchemaTimestampsConfig } from 'mongoose'

const { ObjectId } = Schema.Types
interface ICartItem {
  CartId: Types.ObjectId
  Quantity: Number
  ProductId: Types.ObjectId
}
interface CartItemDoc extends Document, ICartItem, SchemaTimestampsConfig {}
interface CartItemModel extends Model<CartItemDoc> {
  build(attrs: ICartItem): CartItemDoc
}
const cartItemSchema = new Schema<ICartItem>({
  CartId: {
    type: ObjectId,
    ref: 'Cart',
    required: true,
  },
  Quantity: {
    type: Number,
    default: 1,
  },
  ProductId: {
    type: ObjectId,
    ref: 'Product',
    required: true,
  },
})
cartItemSchema.statics.build = (attrs: ICartItem) => {
  return new CartItem(attrs)
}
const CartItem = model<CartItemDoc, CartItemModel>('CartItem', cartItemSchema)
CartItem.createIndexes()

export default CartItem
