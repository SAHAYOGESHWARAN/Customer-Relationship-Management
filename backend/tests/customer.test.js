import request from 'supertest';
import app from '../index.js';

describe('Customer API', () => {
    let token;

    beforeAll(async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'Password123' });
        token = loginRes.body.token;
    });

    it('should get a list of customers', async () => {
        const res = await request(app)
            .get('/api/customers')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.customers).toBeInstanceOf(Array);
    });

    it('should create a new customer', async () => {
        const res = await request(app)
            .post('/api/customers')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'New Customer',
                email: 'newcustomer@example.com',
                phone: '1234567890'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'New Customer');
    });
});
