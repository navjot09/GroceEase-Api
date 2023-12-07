import { Schema, model, Types, SchemaTimestampsConfig, Model } from 'mongoose'

const { ObjectId } = Schema.Types
interface IProduct {
  Name: string
  Brand?: string
  Description?: string
  Category: Types.ObjectId
  SubCategory?: Types.ObjectId
  Image?: string
  Price: number
  OnSale: boolean
  DiscountPrice?: number
  Rating?: number
  Type?: string
  Stock: number
  isActive: boolean
  Quantity?: string
}

interface ProductDoc extends Document, IProduct, SchemaTimestampsConfig {}
interface ProductModel extends Model<ProductDoc> {
  build(attrs: IProduct): ProductDoc
}
const productSchema = new Schema<IProduct>(
  {
    Name: { type: String, required: true },
    Brand: { type: String },
    Description: { type: String },
    Category: { type: ObjectId, required: true, ref: 'Category', index: true },
    SubCategory: { type: ObjectId, ref: 'Category' },
    Image: { type: String },
    Price: { type: Number, required: true },
    OnSale: { type: Boolean, default: false },
    Type: { type: String },
    DiscountPrice: { type: Number },
    Rating: { type: Number },
    Stock: { type: Number, default: 0 },
    Quantity: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)
productSchema.index(
  {
    Name: 'text',
    Brand: 'text',
    Type: 'text',
    Description: 'text',
  },
  {
    weights: {
      Name: 10,
      Brand: 5,
      Type: 5,
      Description: 3,
    },
  },
)
productSchema.statics.build = (attrs: IProduct) => new Product(attrs)
const Product = model<ProductDoc, ProductModel>('Product', productSchema)
Product.createIndexes()

export default Product
