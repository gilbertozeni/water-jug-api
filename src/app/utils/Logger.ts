import winston, { format } from 'winston';

class Logger {

    private logger: winston.Logger
    private static instance: Logger

    private constructor() {
        this.logger = winston.createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    level: "error",
                    filename: "../logs/error.log",
                    handleExceptions: true,
                    maxsize: 5242880,
                    maxFiles: 5,
                })
            ]
        })
    }

    public static getLoggerInstance(){
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance
    }

    public static getLogger(){
        let _logger = Logger.getLoggerInstance()
        return _logger.logger

    }

}

export default Logger;