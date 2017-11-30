module.exports = {
  config: {
    open: true,
    delay: 0,
    cookie: {
      url: 'http://www.xxx.com',
      fill: [
        {
          selector: '#TANGRAM__PSP_3__userName',
          value: 'imaptest0203'
        },
        {
          selector: '#TANGRAM__PSP_3__password',
          value: 'aaa'
        },
        {
          selector: '#TANGRAM__PSP_3__verifyCode',
          value: 'aaaa'
        }
      ],
      submit: '#TANGRAM__PSP_3__submit'
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
