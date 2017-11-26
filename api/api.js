module.exports = {
  config: {
    open: true,
    cookie: '',
    server: 'http://www.jianshu.com/'
  },
  request: {
    'get /api/get': ctx => {
      ctx.body = {
        status: 'ok',
        data: 'get'
      };
    },
    '/api/all': ctx => {
      ctx.body = {
          status: 'ok',
          data: 'all'
      };
    },
    '/api/json': {json: 111},
    '/api/user/:id': cxt => {
      cxt.body = {
        status: 'ok',
        user: cxt.params.id,
        query: cxt.query
      };
    },
    '/notes/20183954/side_tool': 'http://www.jianshu.com/notes/20183954/side_tool'
  }
};
