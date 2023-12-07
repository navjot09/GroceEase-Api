import Category from '@models/category.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'

export const getCategories = asynchHandler(
  async (
    req: Request<
      object,
      object,
      object,
      {
        include?: 'children'
      }
    >,
    res: Response,
  ) => {
    const { include } = req.query
    if (include === 'children') {
      const result = await Category.aggregate([
        {
          $group: {
            _id: '$Parent',
            children: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'parent',
          },
        },
        {
          $unwind: '$parent',
        },
      ]).exec()
      res.status(200).json({ success: true, data: result })
      return
    }
    const result = await Category.where('Parent').exists(false)
    res.status(200).json({ success: true, data: result })
  },
)

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
