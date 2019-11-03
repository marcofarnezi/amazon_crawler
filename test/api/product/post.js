process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const bodyParser = require('body-parser');

const routes = require('../../../src/routes');
routes.use(bodyParser);
const conn = require('../../../src/db/index')

describe('POST /products', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })    

    it('OK, loading products from Amazon', (done) => {
        request(routes).post('/products', {search: "ipad"})   
            .then((resp) => {
                const body = resp.body;                
                expect(body).to.contain.prototype('loaded');
                done();
            })
            .catch((err) => done(err));
    })
})