import { Schema, model, Types, Model, Document, SchemaTimestampsConfig } from 'mongoose'

const { ObjectId } = Schema.Types

interface IUser {
  Name: string
  Email: string
  Password: string
  Phone: string
  DateOfBirth?: Date
  DeliveryAddress: Types.ObjectId
}
interface UserDoc extends Document, IUser, SchemaTimestampsConfig {}

interface UserModel extends Model<UserDoc> {
  build(attrs: IUser): UserDoc
}

const userSchema = new Schema(
  {
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Phone: { type: String, required: true },
    DateOfBirth: { type: Date },
    DeliveryAddress: { type: ObjectId, ref: 'Address' },
  },
  { timestamps: true },
)

const User = model<UserDoc, UserModel>('User', userSchema)
User.createIndexes()
userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs)
}
export default User
