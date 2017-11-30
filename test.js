const CDP = require("chrome-remote-interface");

const getCookie = () => {
  // document.querySelector('#login_username').value = 'xx';
  // document.querySelector('#login_password').value = 'xx';
  // document.querySelector('#login-form > div:nth-child(4) > button').click();
};

CDP(client => {
  const {Page, DOM, Runtime, Network} = client;
  Page.enable().then(() => {
    return Page.navigate({url: 'xx'});
  }).then(() => {
    DOM.getDocument((err, params) => {
      Runtime.evaluate({
        expression: `(${getCookie})()`,
      }).then(async () => {
        await setTimeout(async () => {
          const cookie = await Network.getCookies();
          const cookies = cookie.cookies;
          let cookieStr = '';

          cookies.forEach(cookie => {
            cookieStr += cookie.name + '=' + cookie.value + ';';
          });

          console.log(cookieStr);
        }, 100);
      });
      
    });
  })

}).on("error", err => {
 // cannot connect to the remote endpoint
 console.error(err);
});
