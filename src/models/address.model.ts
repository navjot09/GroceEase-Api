import { Schema, model, Types, Model, SchemaTimestampsConfig } from 'mongoose'

const { ObjectId } = Schema.Types

interface IAddress {
  UserId: Types.ObjectId
  AddressLine1: string
  City: string
  State: string
  ZipCode: number
}
interface AddressDoc extends Document, IAddress, SchemaTimestampsConfig {}

interface AddressModel extends Model<AddressDoc> {
  build(attrs: IAddress): AddressDoc
}

const addressSchema = new Schema<IAddress>(
  {
    UserId: { type: ObjectId, required: true },
    AddressLine1: { type: String, required: true },
    City: { type: String, required: true },
    State: { type: String, required: true },
    ZipCode: { type: Number, required: true },
  },
  { timestamps: true },
)
addressSchema.statics.build = (attrs: IAddress) => new Address(attrs)
const Address = model<AddressDoc, AddressModel>('Address', addressSchema)
Address.createIndexes()

export default Address
