import Admin from '@models/admin.models'
import { JWT_SECRET } from '@utils/config'
import Logger from '@utils/logger'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization
    if (bearerToken && JWT_SECRET) {
      const token = bearerToken.split(' ')[1]
      const adminData = verify(token, JWT_SECRET) as { sub: string; scope: string }
      if (adminData?.scope !== 'admin') {
        res.status(401).json({ title: 'Authentication Fail', message: 'Invalid Scope' })
        return next('route')
      }
      const admin = await Admin.findOne({ _id: adminData.sub })
      if (admin) {
        res.locals.id = admin._id
        return next()
      }
      res.status(404).json({ title: 'Authentication Fail', message: 'No admin found' })
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
