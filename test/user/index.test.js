const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = chai;
const URL = 'http://localhost:8080';
const environment = {
    auth: {
        username: 'arbofercho',
        password: '123'
    },
    token: ''
};

describe('User', function() {
    describe('POST /auth', function() {
        it('Los usuarios invalidos no pueden obtener un token', function(done) {
            this.timeout(30000);
            chai.request(URL)
                .post('/auth')
                .send({ ...environment.auth, ...{ password: 'abc' } })
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(401);
                    expect(res.body).to.not.have.property('token');
                    expect(res.body.token).to.be.undefined;
                    done();
                });
        });

        it('El usuario puede autenticarse y obtener un token', function(done) {
            this.timeout(30000);
            chai.request(URL)
                .post('/auth')
                .send(environment.auth)
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.not.be.undefined;
                    environment.token = `Bearer ${res.body.token}`;
                    done();
                });
        });
    });

    describe('GET /user', function() {
        it('El endpoint esta protegido mediante JWT', function(done) {
            chai.request(URL)
                .get('/user')
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('Obtiene todos los usuarios cuando se envio el token JWT', function(done) {
            chai.request(URL)
                .get('/user')
                .set('Authorization', environment.token)
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });
});