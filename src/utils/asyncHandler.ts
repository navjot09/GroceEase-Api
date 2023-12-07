import { NextFunction, Request, Response } from 'express'
import Logger from './logger'

export const asynchHandler = <TRequest>(
  fn: (req: Request<TRequest>, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request<TRequest>, res: Response, next: NextFunction) =>
    fn(req, res, next).catch((err) => {
      Logger.error(err)
      res.status(400).json({ success: false, title: 'Failed', message: 'Something went wrong' })
    })
}
