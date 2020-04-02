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
  },
  /**
   * 歌词解析
   */
  parseLrc(lrc) {
    if (!lrc) return 0    //没有歌词文件
    var lrcText = []
    var lrcTitle = []
    var lines = lrc.split('\n')  // 将歌词分割成一行行数据
    var lineNum = 0
    lines.forEach(line => {
      var prefix = line.match(/\[(.+?)\]/g)  // 找到形如[xxx]的文本
      var text = ''
      if (prefix) {
        prefix.forEach(t => {   //可能会有[xx:xx][xx:xx][xx:xx] xxxx 这样的存在
          let tt = t.match(/(\d.+\d)/g)   // 匹配带时间的[xxx]
          if (tt) {
            text = line.substr(line.lastIndexOf(']') + 1)  // 去除时间信息的歌词文本
            if (text.trim()) {   //只添加非空行
              // let tn = util.parseTime(tt[0])   // 解析时间文件为数字：s
              let tn = tt[0]   // 解析时间文件为数字：s
              lrcText.push([tn, text])     // 保存解析数据
              lineNum += 1
            }
          } else {
            text = line.trim().slice(1, -1)  // 头部几行信息，没有时间，去掉左右的[]
            if (text) {
              lrcTitle.push(text)
              lineNum += 1
            }
          }
        })
      }
    })
    return {lineNum,lrcText}
  }
}