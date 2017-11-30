const HeadlessChrome = require('simple-headless-chrome');
const browser = new HeadlessChrome({
  headless: true
});

module.exports = async ({url, fill, submit} = config) => {
  await browser.init();
  const mainTab = await browser.newTab({privateTab: false});

  await mainTab.goTo(url);

  await (async () => {
    for (let section of fill) {
      await mainTab.fill(section.selector, section.value);
    }
  })();

  await mainTab.wait(1000);

  await mainTab.click(submit);
  await mainTab.wait(1500);

  const cookie = await mainTab.getCookies();
  const cookies = cookie.cookies;
  let cookieStr = '';

  cookies.forEach(cookie => {
    cookieStr += cookie.name + '=' + cookie.value + ';';
  });
  
  await browser.close();

  return cookieStr;
};
