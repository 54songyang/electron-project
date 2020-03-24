import electron from 'electron';
const session = electron.remote.session;
export default {
  //设置登录cookie
  setCookie(name, value) {
    var Days = 15;
    var exp = new Date();
    var date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60;
    const cookie = {
      url: "http://www.request.pipicong.top/login/",
      name: name,
      value: value,
      expirationDate: date
    };
    session.defaultSession.cookies.set(cookie, (error) => {
      if (error) console.error(error);
    });
  },
  //清楚缓存
  cleanCookie() {
    session.defaultSession.clearStorageData({
      origin: '/',
      storages: ['cookies']
    }, error => {
      if (error) console.error(error);
    })
  },
  //获取cookies
  getCookie(url) {
    session.defaultSession.cookies.get({ url }, (error, cookies) => {
      console.log(cookies);
      if (cookies.length > 0) {
        _this.logText = cookies[0].value;
      }
    });
  }
}