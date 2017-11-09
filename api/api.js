module.exports = {
    config: {
        open: true,
        delay: () => {
            return Math.random() * 1.2 * 1000
        },
        testServer: 'http://www.xxx.com',
        cookie: ''
    },
    request: {
        '/api/test': {
            ok() {
                return {
                    a: 1,
                    b: 2
                };
            }
        }
    }
};