const plugin = {
    name: 'moviesHandler',
    version: '1.0.0',
    register: (server, options) => {
        server.route([
            {
                method: 'GET',
                path: '/movie',
                handler: getAll
            },
            {
                method: 'GET',
                path: '/movie/{title}',
                handler: getByTitle
            }
        ]);
    }
};

async function getAll(req, h) {
    return await h.act({role: 'movies', cmd: 'getAll'});
}

async function getByTitle(req, h) {
    const payload = { args: req.params };
    return await h.act({role: 'movies', cmd: 'getByTitle'}, payload);
}

module.exports = plugin;