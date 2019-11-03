process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const bodyParser = require('body-parser');

const routes = require('../../../src/routes');
routes.use(bodyParser);
const conn = require('../../../src/db/index')

describe('GET /products', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })    

    it('OK, loading products on DB', (done) => {
        request(routes).get('/products')   
            expect(200);
    })
})