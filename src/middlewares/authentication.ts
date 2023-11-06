import User from '@models/user.model'
import { JWT_SECRET } from '@utils/config'
import Logger from '@utils/logger'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization
    if (bearerToken && JWT_SECRET) {
      const token = bearerToken.split(' ')[1]
      const userData = verify(token, JWT_SECRET) as { userId: string }
      const user = await User.findOne({ _id: userData.userId })
      if (user) {
        res.locals.id = user._id
        return next()
      }
      res.status(404).json({ title: 'Authentication Fail', message: 'No user found' })
      return next('route')
    }
    res.status(401).json({ title: 'Authentication Fail', message: 'Invalid Token' })
    return next('route')
  } catch (error: any) {
    res.status(400).json({ title: 'Authentication Fail', message: error?.message })
    Logger.error(error)
    return next('route')
  }
}
