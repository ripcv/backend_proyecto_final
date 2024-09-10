import winston from "winston"

const customLevelsOptions = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        debug:4,
    },
    colors:{
        fatal:'magenta',
        error:'red',
        warning:'yellow',
        info:'blue',
        debug:'white',
    }
}

const devLogger = winston.createLogger({

    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
})

export const logger = process.env.LOGGER_TYPE === 'production' ? prodLogger : devLogger;

export const addLogger = (req,res,next) => {
    req.logger = logger
    req.logger.info(`Log recibido: ${req.method} ${req.url} - ${new Date().toLocaleString()}`)
    next()
}


