import { Schema, model, Types, Document, SchemaTimestampsConfig, Model } from 'mongoose'

interface IVendor {
  Name: string
  Email: string
  Phone: string
  Rating: number
  Logo?: string
  Website?: string
}
interface VendorDoc extends Document, IVendor, SchemaTimestampsConfig {}

interface VendorModel extends Model<VendorDoc> {
  build(attrs: IVendor): VendorDoc
}
const vendorSchema = new Schema(
  {
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Phone: { type: String, required: true },
    Rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    Logo: { type: String },
    Website: { type: String },
  },
  { timestamps: true },
)

const Vendor = model<VendorDoc, VendorModel>('Vendor', vendorSchema)
Vendor.createIndexes()
vendorSchema.statics.build = (attrs: IVendor) => {
  return new Vendor(attrs)
}
export default Vendor
