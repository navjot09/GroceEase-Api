import Product from '@models/product.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'

export const getProducts = asynchHandler(
  async (
    req: Request<
      object,
      object,
      object,
      {
        limit?: string
        offset?: string
        category?: string
        subCategory?: string
        search?: string
        sort?: string
      }
    >,
    res: Response,
  ) => {
    const { limit, offset, category, subCategory, search, sort } = req.query
    const newLimit = limit ? Number(limit) : 25
    const newOffset = offset ? Number(offset) : 0
    const query = Product.aggregate()
    const subCategories = subCategory?.split(',')
    const matchStage: any = {
      $text: { $search: search },
    }
    if (category) {
      matchStage.Category = category
    }
    if (subCategories) {
      matchStage.SubCategory = { $in: subCategories }
    }
    if (search) {
      matchStage.$text = { $search: search }
    }
    query.match(matchStage)
    query.addFields({
      FinalPrice: { $ifNull: ['$DiscountPrice', '$Price'] },
    })
    if (sort) {
      const [sortField, sortDirection] = sort.split(':')
      if (
        sortField &&
        sortDirection &&
        ['Price', 'Rating'].includes(sortField) &&
        ['DESC', 'ASC'].includes(sortDirection)
      ) {
        query.sort({
          [sortField === 'Price' ? 'FinalPrice' : 'Rating']: sortDirection === 'ASC' ? 1 : -1,
        })
      } else {
        return res.status(400).json({ title: 'Invalid Request', message: 'Unsupported Sort' })
      }
    } else if (search) {
      query.sort({ score: { $meta: 'textScore' } })
    }
    const result = await query.skip(newOffset).limit(newLimit).exec()
    return res.status(200).json(result)
  },
)
