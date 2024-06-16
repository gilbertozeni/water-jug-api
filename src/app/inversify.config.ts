import { Container } from 'inversify';
import WaterJugController from './controllers/v1/WaterJugController';
import WaterJugService from './services/WaterJugService';
import { ValidationMiddleware } from './middleware/ValidationMiddleware';

const container = new Container();

//configs
container.bind<ValidationMiddleware>(ValidationMiddleware).toSelf().inSingletonScope();

//controllers
container.bind<WaterJugController>('WaterJugController').to(WaterJugController);

//services
container.bind<WaterJugService>('WaterJugService').to(WaterJugService);

export default container;