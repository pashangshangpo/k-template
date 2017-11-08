/**
 * @file api.js
 * @date 2017-10-12 00:03
 * @author xiaozhihua
 */
module.exports = {
    config: {
        open: true,
        delay: () => {
            return Math.random() * 1.2 * 1000
        },
        testServer: 'http://www.baidu.com',
        // cookie: 'nb-referrer-hostname=www.ilingdai.com; nb-start-page-url=http%3A%2F%2Fwww.ilingdai.com%2F; Hm_lvt_ec0bf5a96aecadc62772480633c778b2=1507651548,1507910914; Hm_lpvt_ec0bf5a96aecadc62772480633c778b2=1507984125; PHPSESSID=c1uhucm26mqaidb15uql9rdle5; REMEMBERME=Qml6XFVzZXJcQ3VycmVudFVzZXI6ZFhObGNsOWpkVGx6WjJONmVIUkFaV1IxYzI5b2J5NXVaWFE9OjE1Mzk1MjAxNDE6MWExOTI5NzY0NTgyNTg3N2JlM2JlNDBjMDgwNGJlZDlhZmNlYzRiYzE0NzhhMGIwZjAzYjU4NWMxODBjMjVkOA%3D%3D',
    },
    request: {
        '/api/test': {
            ok() {
                return {
                    a: 1,
                    b: 2
                };
            }
        }
    }
};