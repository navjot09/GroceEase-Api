import User from '@models/user.model'
import { asynchHandler } from '@utils/asyncHandler'
import { JWT_SECRET } from '@utils/config'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
export const authenticate = asynchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization
    if (bearerToken && JWT_SECRET) {
      const token = bearerToken.split(' ')[1]
      const userData = verify(token, JWT_SECRET) as { sub: string }
      // `exists` keeps the revoked/deleted-user check but returns only { _id }
      // instead of hydrating the full user document (bcrypt hash included) on
      // every authenticated request. res.locals.id must stay an ObjectId: it
      // feeds aggregation $match stages, which do not apply schema casting, so
      // a raw string there would silently match zero documents.
      const user = await User.exists({ _id: userData.sub })
      if (user) {
        res.locals.id = user._id
        return next()
      }
      return res.status(404).json({ title: 'Authentication Fail', message: 'No user found' })
    }
    return res.status(401).json({ title: 'Authentication Fail', message: 'Invalid Token' })
  },
)
