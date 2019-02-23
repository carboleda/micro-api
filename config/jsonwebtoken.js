const secretOrPrivateKey = 'devhack.com';

module.exports = {
    secretOrPrivateKey,
    validate: async (req, payload, h) => {
        let credentials = {};
        if(payload.email) {
            credentials.email = payload.email;
            return { isValid: true, credentials }
        }
        return { isValid: false, credentials };
    }
};