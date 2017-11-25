module.exports = {
    config: {
        open: true,
        cookie: ''
    },
    request: {
        '/api/test': function () {
          return {
            status: 'ok'
          };
        }
    }
};
