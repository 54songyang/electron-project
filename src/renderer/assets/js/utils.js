import electron from 'electron';
import axios from 'axios'
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
    return { lineNum, lrcText }
  },
  /**
   * 歌曲是否可用
   * @param {String|Number} id 歌曲id
   * @returns 歌曲是否可用
   */
  canUse(id) {
    return axios({
      url: `/check/music?id=${id}&timerstamp=${Date.now()}`
    }).then(res => {
      const { success, message } = res
      return (success === true && message === "ok")
    })
  },
  /**
   * 获取歌词
   * @param {String|Number} id 歌曲id
   * @returns 获取歌词
   */
  musicLrc(id) {
    //获取歌词
    return axios({
      url: `/lyric?id=${id}&timerstamp=${Date.now()}`
    }).then(res => {
      console.log("获取歌词", res);
      return res.lrc.lyric
    })
  },
  /**
   * 歌曲详情
   * @param {Array} ids 歌曲id
   * @returns 歌曲详情
   */
  musicDetail(ids) {
    return axios({
      url: `/song/detail?ids=${ids.join(',')}&timerstamp=${Date.now()}`,
      withCredentials: true,
    }).then(res => {
      console.log("歌曲详情", res.songs);
      return res.songs
    })
  },
  /**
   * 用户登录状态
   * @returns 用户信息
   */
  loginStatus() {
    return axios({
      url:
        `/login/status?timerstamp=${Date.now()}`,
      withCredentials: true
    })
      .then(({data:res}) => {
        console.log("用户登录状态", res);
        if (res.code === 200) return res
      })
  },
  /**
   * 用户登录
   * @param {*} param0 
   * @returns 用户登录
   */
  userLogin({ account, password }) {
    //!!!暂时使用邮箱登录
    return axios({
      url:
        // `/login/cellphone?phone=${account}&password=${password}&timerstamp=${Date.now()}`,
        `/login?email=${account}&password=${password}&timerstamp=${Date.now()}`,
      // `/login?email=m13522499772@163.com&password=songyang123&timerstamp=${Date.now()}`,
      withCredentials: true,
    })
      .then(res => {
        console.log("用户登录", res);
        if (res.code === 200) return res
      })
  },
  /**
   * 获取用户歌单
   * @param {String} id 歌单id
   * @returns 歌单信息
   */
  getUserPlaylist(id) {
    return axios({
      url:
        `user/playlist?uid=${id}`
    })
      .then(res => {
        console.log("获取用户歌单", res);
        if (res.code === 200) {
          return res.playlist
        }
      })
  },
  /**
   * 退出登录
   * @returns 
   */
  logout() {
    return axios({
      url:
        "/logout"
    })
      .then(res => {
        console.log("退出登录", res);
        if (res.code === 200) {
          return res
        }
      })
  },
  /**
   * 二维码key生成接口
   * @returns 
   */
  getQrKey() {
    return axios({
      url:
        "/login/qr/key",
      withCredentials: true,
    })
      .then(res => {
        console.log("二维码key生成接口", res);
        if (res.code === 200) {
          return res.data.unikey
        }
      })
  },
  /**
   * 生成二维码
   * @param {*} key 
   * @returns 
   */
  getQrcode(key) {
    return axios({
      url:
        `/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`,
      withCredentials: true,
    })
      .then(res => {
        console.log("生成二维码", res);
        if (res.code === 200) {
          return res.data.qrimg
        }
      })
  },
  /**
   * 校验二维码
   * @param {*} key 
   * @returns 
   */
  getQrCheck(key) {
    return axios({
      url:
        `/login/qr/check?key=${key}&timerstamp=${Date.now()}`,
      withCredentials: true,
    })
      .then(res => {
        console.log("校验二维码", res);
        return res
      })
  }
}