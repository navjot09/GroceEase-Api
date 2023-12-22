import Address from '@models/address.model'
import { asynchHandler } from '@utils/asyncHandler'
import { Request, Response } from 'express'
import Validator from 'validatorjs'

export const getAddress = asynchHandler(async (req: Request, res: Response) => {
  const addresses = await Address.find({ UserId: res.locals.id })
  res.status(200).json({ success: true, data: addresses })
})
export const postAddress = asynchHandler(
  async (
    req: Request<
      object,
      object,
      { addressLine1: string; city: string; state: string; zipCode: number }
    >,
    res: Response,
  ) => {
    const validationRules = {
      addressLine1: 'required|string',
      city: 'required|string',
      state: 'required|string',
      zipCode: 'required|integer',
    }
    const validation = new Validator(req.body, validationRules)
    if (validation.fails()) {
      res
        .status(400)
        .send({ success: false, title: 'Validation Fail', message: 'Input Validation Failed' })
      return
    }
    const { addressLine1, city, state, zipCode } = req.body
    const address = Address.build({
      UserId: res.locals.id,
      AddressLine1: addressLine1,
      City: city,
      State: state,
      ZipCode: zipCode,
    })
    await address.save()
    res.status(201).json({ success: true, title: 'Success', message: 'Address Saved Succesfully' })
  },
)

export const getAddressById = asynchHandler(async (req: Request<{ id: string }>, res: Response) => {
  const address = await Address.findOne({ _id: req.params.id })
  if (!address) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Address not found' })
    return
  }
  if (address?.UserId?.equals(res.locals.id)) {
    res.status(200).json({ success: true, data: address })
    return
  }
  res
    .status(401)
    .json({ success: false, title: 'Unauthorized', message: "Address doesn't belongs to user" })
})

export const deleteAddress = asynchHandler(async (req: Request, res: Response) => {
  const address = await Address.findOne({ _id: req.params.id })
  if (!address) {
    res.status(404).json({ success: false, title: 'Not Found', message: 'Address not found' })
    return
  }
  if (address?.UserId?.equals(res.locals.id)) {
    await Address.findByIdAndDelete(address._id)
    res
      .status(200)
      .json({ success: true, title: 'Success', message: 'Address Deleted Succesfully' })
    return
  }
  res
    .status(401)
    .json({ success: false, title: 'Unauthorized', message: "Address doesn't belongs to user" })
})
