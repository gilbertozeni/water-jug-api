import "reflect-metadata";
import WaterJugService from '../../../app/services/WaterJugService';
import { Container } from 'inversify';


describe("water jug service", () => {
    let container: Container;
    let waterJugService: WaterJugService;

    beforeAll(() => {
      container = new Container();
      container.bind<WaterJugService>('WaterJugService').to(WaterJugService);
      waterJugService = container.get('WaterJugService');
    });
    
    it('basic valid scenario', async () => {
        const res = await waterJugService.solve(2, 100, 96);
        expect(res.length).toStrictEqual(4);
    });

    it('basic invalid scenario', async () => {
        expect(waterJugService.solve(2, 10, 3)).rejects.toStrictEqual("The amount wanted is not possible to achieve");
    });

  })