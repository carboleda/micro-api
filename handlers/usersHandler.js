const Joi = require('joi');
const plugin = {
    name: 'usersHandler',
    version: '1.0.0',
    register: (server, options) => {
        server.route([
            {
                method: 'POST',
                path: '/auth',
                options: {
                    auth: false,
                    validate: {
                        //payload|params|query
                        payload: {
                            username: Joi.string().min(3).max(30).required(),
                            password: Joi.string().min(3).max(50).required()
                        }
                    }
                },
                handler: auth
            },
            {
                method: 'GET',
                path: '/user',
                handler: getAll
            },
            {
                method: 'GET',
                path: '/user/{username}',
                handler: getByUsername
            }
        ]);
    }
};

async function auth(req, h) {
    try {
        const payload = { args: req.payload };
        const user = await h.act({role: 'users', cmd: 'auth'}, payload);
        const token = req.server.methods.jwtSign(user);
        return { ...user, token };
    } catch(err) {
        return h.response({msg: err.message}).code(401);
    }
}

async function getAll(req, h) {
    const authorization = req.headers.authorization;
    return await h.act({role: 'users', cmd: 'getAll'}, { authorization });
}

async function getByUsername(req, h) {
    const payload = { args: req.params };
    return await h.act({role: 'users', cmd: 'getByUsername'}, payload);
}

module.exports = plugin;