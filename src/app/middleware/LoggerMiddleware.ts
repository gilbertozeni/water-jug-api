import Logger from "../utils/Logger";
import morgan, { StreamOptions } from "morgan";

const logger = Logger.getLogger();

const stream: StreamOptions = {
    write: (message) => logger.info(message),
};

const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream }
);

export default morganMiddleware;