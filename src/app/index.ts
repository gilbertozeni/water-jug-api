import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from './inversify.config';
import Logger from './utils/Logger';
import morganMiddleware from './middleware/LoggerMiddleware';

const port = process.env.PORT || 3000;
let server = new InversifyExpressServer(container);
const logger = Logger.getLogger();

server.setConfig((app) => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(morganMiddleware)
});

server.setErrorConfig((app) => {
  app.use((err: any, req: any, res: any, next: any) => {
    if(err) {
      logger.error(err.stack);
      res.status(500).send({ message: "Something is broken :(" });
    }
    next();
  });
});

let app = server.build();
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => logger.info(`Listening on port ${port}`));
}

export default app;
