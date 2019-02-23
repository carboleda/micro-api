const HapiJWT = require('hapi-jsonwebtoken');
const HapiJWTConfig = require('./config/jsonwebtoken');
const config = require('./config/config.json');
const Hapi = require('hapi');
const PORT = process.env.PORT || 8080;
const validate = {
    failAction: (request, h, err) => {
        // During development, log and respond with the full error.
        console.error(err);
        throw err;
    }
};
const server = Hapi.Server({
    host: 'localhost',
    port: PORT,
    routes: {
        /*
        Fuente: https://github.com/hapijs/hapi/issues/3706
        In prod, log a limited error message and throw the default Bad Request error.
        */
        validate: process.env.NODE_ENV === 'production' ? undefined : validate
    }
});
server.route({
    method: 'GET',
    path: '/hello',
    handler: (request, h) => {
        return 'Hello Hapi';
    }
});

async function start() {
    try {
        //await server.register(require('./plugins/seneca'));
        await server.register({ plugin: require('./plugins/seneca'), options: config.seneca });
        await server.register(HapiJWT.plugin);
        server.auth.strategy('jwt', 'hapi-jsonwebtoken', HapiJWTConfig);
        server.auth.default('jwt');
        await server.register(require('./handlers/moviesHandler'));
        await server.register(require('./handlers/usersHandler'));
        await server.start();
        console.log(`Servidor activo en ${server.info.uri}`);
    } catch (error) {
        console.error('Error iniciando servidor', error);
    }
}

start();