module.exports = {
  config: {
    open: true,
    delay: 0,
    cookie: {
      url: 'http://www.xx.top/login',
      fill: [
        {
          selector: '#user',
          value: '1'
        },
        {
          selector: '#pass',
          value: '1'
        }
      ],
      submit: '#content > div.aui-page-panel > div > section > form > div.buttons > input'
    },
    server: 'http://www.xx.top'
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
