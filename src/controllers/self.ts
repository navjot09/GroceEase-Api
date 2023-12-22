import User from '@models/user.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'

export const getMyDetails = asynchHandler(async (req: Request, res: Response) => {
  const user = await User.findById(res.locals.id, { Name: 1, Email: 1, DateOfBirth: 1, Phone: 1 })
  return res.status(200).json({ success: true, data: user })
})
