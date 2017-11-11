module.exports = {
  dev: {
    css: [
      '//www.ddi.com/cc.css'
    ],
    js: [
      'dev/js/lib/vendor.dll.js?v=15.4',
      'js/@entryName@.bundle.js',
      'http://www.baidu.com',
      function () {
        window.aaa = 10;
        console.log(window.aaa);
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
