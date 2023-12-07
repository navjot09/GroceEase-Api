import winston from 'winston'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const folderPath = process.env.LOG_FOLDER || 'logs'
const level = process.env.LOG_LEVEL || 'debug'

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf((info: winston.Logform.TransformableInfo) => `${info.message}`),
)

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize({ all: true })),
  }),
  new winston.transports.File({
    filename: `${folderPath}/error.log`,
    level: 'error',
  }),
  new winston.transports.File({ filename: `${folderPath}/app.log` }),
]

const Logger = winston.createLogger({
  level,
  levels,
  format,
  transports,
})

export default Logger
