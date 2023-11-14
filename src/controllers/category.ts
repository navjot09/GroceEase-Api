import Category from '@models/category.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'

export const getCategories = asynchHandler(async (req: Request, res: Response) => {
  const result = await Category.where('Parent').exists(false)
  res.status(200).json(result)
})

export const getCategoryDetails = asynchHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const category = await Category.findOne({ _id: req.params.id })
    if (!category) {
      res.status(404).json({ title: 'Not Found', message: 'Category not found' })
      return
    }
    const childrens = await Category.find({ Parent: category._id })
    res.status(200).json({ data: category, Children: childrens })
  },
)
