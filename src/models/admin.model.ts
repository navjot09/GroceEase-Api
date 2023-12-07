import mongoose, { Document, Model, Schema, SchemaTimestampsConfig } from 'mongoose'

interface IAdmin {
  Name: string
  Email: string
  Password: string
  Phone: string
}
interface AdminDoc extends Document, IAdmin, SchemaTimestampsConfig {}

interface AdminModel extends Model<AdminDoc> {
  build(attrs: IAdmin): AdminDoc
}

const adminSchema = new Schema<IAdmin>(
  {
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Phone: { type: String, required: true },
  },
  { timestamps: true },
)
adminSchema.statics.build = (attrs: IAdmin) => new Admin(attrs)

const Admin = mongoose.model<AdminDoc, AdminModel>('Admin', adminSchema)
Admin.createIndexes()
export default Admin
