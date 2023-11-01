import { Schema, model, Types, SchemaTimestampsConfig, Model } from 'mongoose'

const { ObjectId } = Schema.Types
interface IProduct {
  Name: string
  Description: string
  CategoryId: Types.ObjectId
  Image?: string
  Price: number
  OnSale: boolean
  SalePrice?: number
  Stock: number
  Weight?: number
  Unit?: string
  Dimensions?: string
  isActive: boolean
}

interface ProductDoc extends Document, IProduct, SchemaTimestampsConfig {}
interface ProductModel extends Model<ProductDoc> {
  build(attrs: IProduct): ProductDoc
}
const productSchema = new Schema<IProduct>(
  {
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    CategoryId: { type: ObjectId, required: true },
    Image: { type: String },
    Price: { type: Number, required: true },
    OnSale: { type: Boolean, default: false },
    SalePrice: { type: Number },
    Stock: { type: Number, default: 0 },
    Weight: { type: Number },
    Unit: { type: String },
    Dimensions: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const Product = model<ProductDoc, ProductModel>('Product', productSchema)
Product.createIndexes()
productSchema.statics.build = (attrs: IProduct) => {
  return new Product(attrs)
}
export default Product
