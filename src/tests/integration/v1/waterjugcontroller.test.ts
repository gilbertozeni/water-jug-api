import request from 'supertest';
import app from '../../../app/index';
import container from '../../../app/inversify.config';
import e from 'express';

describe('water jug endpoint', () => {

    let validPayload = { x_capacity: 2, y_capacity: 10, z_amount_wanted: 4 };
    let invalidPayload = { x_capacity: 2, y_capacity: 10, z_amount_wanted: 3 };


    it('should return 200 OK for valid values on the request', async () => {  
        const res = await request(app)
                            .post('/api/v1/water-jug/solve')
                            .send(validPayload);
        expect(res.status).toBe(200);
      });

      it('should return 422 UNPROCESSABLE ENTITY if there`s no possible solution', async () => {  
        const res = await request(app)
                                .post('/api/v1/water-jug/solve')
                                .send(invalidPayload);
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('No solution');
      });

      it('should return 400 BAD REQUEST if x_capacity is not set', async () => {  
        const res = await request(app)
                                .post('/api/v1/water-jug/solve')
                                .send({ y_capacity: 10, z_amount_wanted: 3 });
        expect(res.status).toBe(400);
        expect(res.body.errors[0].msg).toBe('x_capacity is required');
      });
      it('should return 400 BAD REQUEST if x_capacity is not an integer', async () => {  
        const res = await request(app)
                                .post('/api/v1/water-jug/solve')
                                .send({ x_capacity: "two", y_capacity: 10, z_amount_wanted: 3 });
        expect(res.status).toBe(400);
        expect(res.body.errors[0].msg).toBe('x_capacity must be an integer');
      });      

      it('should return 400 BAD REQUEST if y_capacity is not set', async () => {  
        const res = await request(app)
                                .post('/api/v1/water-jug/solve')
                                .send({ x_capacity: 10, z_amount_wanted: 3 });
        expect(res.status).toBe(400);
        expect(res.body.errors[0].msg).toBe('y_capacity is required');
      });
      it('should return 400 BAD REQUEST if y_capacity is not an integer', async () => {  
        const res = await request(app)
                                .post('/api/v1/water-jug/solve')
                                .send({ y_capacity: "two", x_capacity: 10, z_amount_wanted: 3 });
        expect(res.status).toBe(400);
        expect(res.body.errors[0].msg).toBe('y_capacity must be an integer');
      });  

      it('should return 400 BAD REQUEST if z_amount_wanted is not set', async () => {  
        const res = await request(app)
                                .post('/api/v1/water-jug/solve')
                                .send({ x_capacity: 10, y_capacity: 3 });
        expect(res.status).toBe(400);
        expect(res.body.errors[0].msg).toBe('z_amount_wanted is required');
      });
      it('should return 400 BAD REQUEST if z_amount_wanted is not an integer', async () => {  
        const res = await request(app)
                                .post('/api/v1/water-jug/solve')
                                .send({ y_capacity: 2 , x_capacity: 10, z_amount_wanted: "three"});
        expect(res.status).toBe(400);
        expect(res.body.errors[0].msg).toBe('z_amount_wanted must be an integer');
      });

});