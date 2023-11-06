import * as dotenv from 'dotenv'

dotenv.config()

export const { PORT, MONGODB_URI, JWT_SECRET, ADMIN_REFER_CODE } = process.env
