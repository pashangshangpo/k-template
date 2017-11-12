module.exports = {
  dev: {
    css: [
    ],
    js: [
      'dev/js/dll/vendor.dll.js?v=15.4',
      'js/@entryName@.bundle.js',
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
