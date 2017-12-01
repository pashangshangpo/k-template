const {Chromeless} = require('chromeless');
const chromeless = new Chromeless();

module.exports = async ({url, fill, submit} = config) => {
  await chromeless
    .goto(url)
    .evaluate((fill, submit) => {
      for (let section of fill) {
        document.querySelector(section.selector).value = section.value;
      }

      document.querySelector(submit).click();
    }, fill, submit)
    .wait(600);

  const cookie = await chromeless.cookies();
  let cookieStr = '';

  cookie.forEach(cookie => {
    cookieStr += cookie.name + '=' + cookie.value + ';';
  });

  await chromeless.end();
  
  return cookieStr;
};
