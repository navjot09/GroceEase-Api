import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import Validator from 'validatorjs'
import jwt from 'jsonwebtoken'
import { ADMIN_REFER_CODE, JWT_SECRET } from '@utils/config'
import User from '@models/user.model'
import Admin from '@models/admin.model'
import { asynchHandler } from '@utils/asyncHandler'
import Cart from '@models/cart.model'

const { sign } = jwt
const { hashSync, genSaltSync, compare } = bcrypt

export const createUser = asynchHandler(
  async (
    req: Request<
      object,
      object,
      {
        name: string
        email: string
        password: string
        phone: string
      }
    >,
    res: Response,
  ) => {
    const validationRules = {
      name: 'required|string',
      email: 'required|email',
      password: 'required|string|min:6',
      phone: 'required',
    }
    const validation = new Validator(req.body, validationRules)
    if (validation.fails()) {
      res
        .status(400)
        .send({ success: false, title: 'Validation Fail', message: 'Input Validation Failed' })
      return
    }
    const { name, email, password, phone } = req.body
    const userAlreadyExists = await User.findOne({ Email: email })
    if (userAlreadyExists) {
      res.status(409).json({ success: false, title: 'Signup Fail', message: 'User Already Exist' })
      return
    }
    const salt = genSaltSync(10)
    const securedPassword = hashSync(password, salt)
    const user = User.build({
      Name: name,
      Email: email,
      Password: securedPassword,
      Phone: phone,
    })
    await user.save()
    const cart = Cart.build({ UserId: user._id })
    await cart.save()
    if (JWT_SECRET) {
      const authToken = sign({ sub: user.id }, JWT_SECRET, {
        expiresIn: '1 day',
      })
      res.status(200).json({
        success: true,
        title: 'Sign Up Successfull.',
        message: 'Sign Up Successfull.',
        data: {
          token: authToken,
        },
      })
    } else {
      res.status(400).json({ title: 'JWT_SECRET missing' })
    }
  },
)

export const loginUser = asynchHandler(
  async (req: Request<object, object, { email: string; password: string }>, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({ Email: email })
    if (!user) {
      res.status(202).json({ success: false, title: 'Login Failed', message: 'User not found.' })
      return
    }
    const passwordCompare = await compare(password, user.Password)
    if (!passwordCompare) {
      res
        .status(202)
        .json({ success: false, title: 'Login Failed', message: 'Password not correct.' })
      return
    }
    if (JWT_SECRET) {
      const authToken = sign({ sub: user.id }, JWT_SECRET, {
        expiresIn: '1 day',
      })
      res.status(200).json({
        success: true,
        title: 'Log In Successfull.',
        message: 'Log In Successfull.',
        data: {
          token: authToken,
        },
      })
    } else {
      res.status(400).json({ title: 'JWT_SECRET missing', message: 'Server Error.' })
    }
  },
)
export const createAdmin = asynchHandler(
  async (
    req: Request<
      object,
      object,
      {
        name: string
        email: string
        password: string
        phone: string
        referCode: string
      }
    >,
    res: Response,
  ) => {
    const validationRules = {
      name: 'required|string',
      email: 'required|email',
      password: 'required|string|min:6',
      phone: 'required',
      referCode: 'required',
    }
    const validation = new Validator(req.body, validationRules)
    if (validation.fails()) {
      res.status(400).send({ title: 'Validation Fail', message: 'Input Validation Failed' })
      return
    }
    const { name, email, password, phone, referCode } = req.body
    const adminAlreadyExists = await Admin.findOne({ Email: email })
    if (adminAlreadyExists) {
      res.status(409).json({ title: 'Signup Fail', message: 'Admin Already Exist' })
      return
    }
    const userAlreadyExists = await User.findOne({ Email: email })
    if (userAlreadyExists) {
      res.status(409).json({ title: 'Signup Fail', message: 'Email registered as user' })
      return
    }
    if (referCode !== ADMIN_REFER_CODE) {
      res.status(401).json({ title: 'Signup Fail', message: 'Invalid Refer Code' })
      return
    }
    const salt = genSaltSync(10)
    const securedPassword = hashSync(password, salt)
    const admin = Admin.build({
      Name: name,
      Email: email,
      Password: securedPassword,
      Phone: phone,
    })
    await admin.save()
    if (JWT_SECRET) {
      const authToken = sign({ sub: admin.id, scope: 'admin' }, JWT_SECRET, {
        expiresIn: '1 day',
      })
      res.status(200).json({
        title: 'Sign Up Successfull.',
        token: authToken,
      })
    } else {
      res.status(400).json({ title: 'JWT_SECRET missing' })
    }
  },
)

export const loginAdmin = asynchHandler(
  async (req: Request<object, object, { email: string; password: string }>, res: Response) => {
    const { email, password } = req.body
    const admin = await Admin.findOne({ Email: email })
    if (!admin) {
      res.status(202).json({ title: 'Login Failed', message: 'Admin not found.' })
      return
    }
    const passwordCompare = await compare(password, admin.Password)
    if (!passwordCompare) {
      res.status(202).json({ title: 'Login Failed', message: 'Password not correct.' })
      return
    }
    if (JWT_SECRET) {
      const authToken = sign({ sub: admin.id, scope: 'admin' }, JWT_SECRET, {
        expiresIn: '1 day',
      })
      res.status(200).json({
        title: 'Log In Successfull.',
        token: authToken,
      })
    } else {
      res.status(400).json({ title: 'JWT_SECRET missing' })
    }
  },
)
