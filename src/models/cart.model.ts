import { Schema, model, Types, SchemaTimestampsConfig, Model } from 'mongoose'

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
  },
})

const Cart = model<CartDoc, CartModel>('Cart', cartSchema)
Cart.createIndexes()
cartSchema.statics.build = (attrs: ICart) => {
  return new Cart(attrs)
}
export default Cart
