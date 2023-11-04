import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import Validator from 'validatorjs'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { JWT_SECRET } from '@utils/config'
import User from '@models/user.model'
import Logger from '@utils/logger'

const { sign } = jwt
const { hashSync, genSaltSync, compare } = bcrypt

export const createUser = async (
  req: Request<
    object,
    object,
    {
      name: string
      email: string
      password: string
      phone: string
      deliveryAddress: Types.ObjectId
    }
  >,
  res: Response,
) => {
  try {
    const validationRules = {
      name: 'required|string',
      email: 'required|email',
      password: 'required|string|min:6',
      phone: 'required',
    }
    const validation = new Validator(req.body, validationRules)
    if (validation.fails()) {
      res.status(400).send({ title: 'Validation Fail', message: 'Input Validation Failed' })
      return
    }
    const { name, email, password, phone, deliveryAddress } = req.body
    const userAlreadyExists = await User.findOne({ email })
    if (userAlreadyExists) {
      res.status(409).json({ title: 'Signup Fail', message: 'User Already Exist' })
      return
    }
    const salt = genSaltSync(10)
    const securedPassword = hashSync(password, salt)
    const user = User.build({
      Name: name,
      Email: email,
      Password: securedPassword,
      Phone: phone,
      DeliveryAddress: deliveryAddress,
    })
    await user.save()
    if (JWT_SECRET) {
      const authToken = sign(user.id, JWT_SECRET)
      res.status(200).json({
        title: 'Sign Up Successfull.',
        token: authToken,
      })
    } else {
      res.status(400).json({ title: 'JWT_SECRET missing' })
    }
  } catch (error: any) {
    Logger.error(error)
    res.status(400).json({ title: 'Signup Failed', message: error?.message })
  }
}

export const loginUser = async (
  req: Request<object, object, { name: string; email: string; password: string; phone: number }>,
  res: Response,
) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      res.status(202).json({ title: 'Login Failed', message: 'User not found.' })
      return
    }
    const passwordCompare = await compare(password, user.Password)
    if (!passwordCompare) {
      res.status(202).json({ title: 'Login Failed', message: 'Password not correct.' })
      return
    }
    if (JWT_SECRET) {
      const authToken = sign(user.id, JWT_SECRET)
      res.status(200).json({
        title: 'Log In Successfull.',
        token: authToken,
      })
    } else {
      res.status(400).json({ title: 'JWT_SECRET missing' })
    }
  } catch (error: any) {
    res.status(400).json({ title: 'Login Failed', message: error?.message })
  }
}
