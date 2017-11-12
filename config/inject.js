module.exports = {
  dev: {
    css: [
    ],
    js: [
      'dev/js/dll/vendor.dll.js?v=15.4',
      'js/@entryName@.bundle.js',
      function (context) {
        let fn = '';
        switch (context) {
          case 'dev':
            fn = function () {
              window.CONTEXT = 'dev';
            };
            break;
          case 'qa':
            fn = function () {
              window.CONTEXT = 'qa';
            };
            break;
          case 'dest':
            fn = function () {
              window.CONTEXT = 'dest';
            };
            break;
        }

        return fn;
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
