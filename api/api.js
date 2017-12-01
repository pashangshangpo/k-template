module.exports = {
  config: {
    open: true,
    delay: 0,
    cookie: {
      url: 'http://www.xx.com/login',
      fill: [
        {
          selector: '#login_username',
          value: 'xx'
        },
        {
          selector: '#login_password',
          value: 'xx'
        }
      ],
      submit: '#login-form > div:nth-child(4) > button'
    },
    server: 'http://www.xx.com'
  },
  request: {
    'get /api/get': ctx => {
      return {
        status: 'ok',
        data: 'get'
      };
    },
    '/api/all': ctx => {
      return {
          status: 'ok',
          data: 'all'
      };
    },
    '/api/json': {json: 111},
    '/api/user/:id': cxt => {
       return {
        status: 'ok',
        user: cxt.params.id,
        query: cxt.query
      };
    }
  }
};
