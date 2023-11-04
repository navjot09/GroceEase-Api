import { Schema, model, SchemaTimestampsConfig, Model } from 'mongoose'

interface ICategory {
  Name: string
  Description?: string
  Image?: string
}
interface CategoryDoc extends Document, ICategory, SchemaTimestampsConfig {}

interface CategoryModel extends Model<CategoryDoc> {
  build(attrs: ICategory): CategoryDoc
}
const categorySchema = new Schema<CategoryDoc>(
  {
    Name: { type: String, required: true },
    Description: { type: String },
    Image: { type: String },
  },
  { timestamps: true },
)
categorySchema.statics.build = (attrs: ICategory) => new Category(attrs)
const Category = model<CategoryDoc, CategoryModel>('Category', categorySchema)
Category.createIndexes()

export default Category
