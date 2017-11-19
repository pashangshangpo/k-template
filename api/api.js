module.exports = {
    config: {
        open: true,
        cookie: ''
    },
    request: {
        '/api/test': function () {
          console.log(this.postData);
          return {
            status: 'ok'
          };
        }
    }
};
