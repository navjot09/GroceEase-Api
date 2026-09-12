import { Schema, model, Types, SchemaTimestampsConfig, Model, Document } from 'mongoose'

const { ObjectId } = Schema.Types

interface ICart {
  UserId: Types.ObjectId
}
interface CartDoc extends Document, ICart, SchemaTimestampsConfig {}
interface CartModel extends Model<CartDoc> {
  build(attrs: ICart): CartDoc
}
const cartSchema = new Schema<ICart>({
  UserId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
})

// `ref` is populate metadata and builds no index. Every cart request starts by
// resolving UserId -> cart, so this index is on the hot path of add, remove and
// every cart read. Unique enforces the one-cart-per-user invariant the
// controllers already assume.
cartSchema.index({ UserId: 1 }, { unique: true })

cartSchema.statics.build = (attrs: ICart) => new Cart(attrs)
const Cart = model<CartDoc, CartModel>('Cart', cartSchema)

export default Cart
