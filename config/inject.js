module.exports = {
  dev: {
    css: [
    ],
    js: [
      function (cxt) {
        if (cxt === 'dev') {
          window.a = '111';
        }
        else {
          console.log('哈哈');
        }
      }
    ]
  },
  dest: {
    css: [
    ],
    js: [
    ]
  }
};
