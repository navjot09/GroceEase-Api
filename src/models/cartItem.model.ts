import { Schema, model, Types, Model, SchemaTimestampsConfig, Document } from 'mongoose'

const { ObjectId } = Schema.Types
export interface ICartItem {
  CartId: Types.ObjectId
  Quantity: number
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

// One compound index serves every query shape on this collection:
//   full key    -> findOne / findOneAndUpdate on { CartId, ProductId } (add, remove)
//   CartId pfx  -> the $lookup foreignField in the cart aggregations, and
//                  deleteMany({ CartId }) at checkout
// `unique` is load-bearing, not hygiene: MongoDB needs a unique index on the
// query fields for concurrent upserts to avoid inserting duplicate rows.
cartItemSchema.index({ CartId: 1, ProductId: 1 }, { unique: true })

cartItemSchema.statics.build = (attrs: ICartItem) => new CartItem(attrs)
const CartItem = model<CartItemDoc, CartItemModel>('CartItem', cartItemSchema)

export default CartItem
