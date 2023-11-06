import Address from '@models/address.model'
import Logger from '@utils/logger'
import { Request, Response } from 'express'
import Validator from 'validatorjs'

export const getAddress = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.find({ UserId: res.locals.id })
    res.status(200).json(addresses)
  } catch (error: any) {
    Logger.error(error)
    res.status(400).json({ title: 'Failed', message: 'Error fetching result' })
  }
}

export const postAddress = async (
  req: Request<
    object,
    object,
    { addressLine1: string; city: string; state: string; zipCode: number }
  >,
  res: Response,
) => {
  try {
    const validationRules = {
      addressLine1: 'required|string',
      city: 'required|string',
      state: 'required|string',
      zipCode: 'required|integer',
    }
    const validation = new Validator(req.body, validationRules)
    if (validation.fails()) {
      res.status(400).send({ title: 'Validation Fail', message: 'Input Validation Failed' })
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
    res.status(201).json({ title: 'Success', message: 'Address Saved Succesfully' })
  } catch (error: any) {
    res.status(400).json({ title: 'Failed', message: error?.message })
  }
}

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const address = await Address.findOne({ _id: req.params.id })
    if (!address) {
      res.status(404).json({ title: 'Not Found', message: 'Address not found' })
      return
    }
    if (address?.UserId?.equals(res.locals.id)) {
      res.status(200).json(address)
      return
    }
    res.status(401).json({ title: 'Unauthorized', message: "Address doesn't belongs to user" })
  } catch (error: any) {
    Logger.error(error)
    res.status(400).json({ title: 'Failed', message: 'Error fetching result' })
  }
}

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const address = await Address.findOne({ _id: req.params.id })
    if (!address) {
      res.status(404).json({ title: 'Not Found', message: 'Address not found' })
      return
    }
    if (address?.UserId?.equals(res.locals.id)) {
      await Address.findByIdAndDelete(address._id)
      res.status(200).json({ title: 'Success', message: 'Address Deleted Succesfully' })
      return
    }
    res.status(401).json({ title: 'Unauthorized', message: "Address doesn't belongs to user" })
  } catch (error: any) {
    Logger.error(error)
    res.status(400).json({ title: 'Failed', message: 'Error Deleting Address' })
  }
}
