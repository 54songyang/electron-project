import axios from '../../axios/index'
const state = {
  topNav: [
    { name: "个性推荐", path: 'mainPage' },
    { name: "歌单", path: 'songSheet' },
    { name: "主播电台", path: 'djprogram' },
    { name: "排行榜", path: 'rankingList' },
    { name: "歌手", path: 'singer' },
    { name: "最新音乐", path: 'newsong' },
  ],
  userInfo: '',
  personalized: [],//歌单推荐
  privatecontent: [], //独家放送
  mvData: [], //推荐MV
  newsong: [], //推荐新音乐
  djprogram: [], //推荐电台
  playlist: [],//用户歌单
  ownRoutes: [],//用户路由
  showLrcPop: false,//显示歌词窗口
  pageActive: 0,//页面
}

const mutations = {
  SET_CLEARSTATE(state, val) {
    state.userInfo = ''
    state.playlist = [];
  },
  SET_USERINFO(state, val) {
    state.userInfo = val;
  },
  SET_PERSONALIZED(state, val) {
    state.personalized = val;
  },
  SET_PRIVATECONTENT(state, val) {
    state.privatecontent = val;
  },
  SET_MVDATA(state, val) {
    state.mvData = val;
  },
  SET_NEWSONG(state, val) {
    state.newsong = val;
  },
  SET_DJPROGRAM(state, val) {
    state.djprogram = val;
  },
  SET_SHOWLRCPOP(state, val) {
    state.showLrcPop = val;
  },
  SET_PLAYLIST(state, val) {
    if (Array.isArray(val)) {
      state.playlist = val
    } else {
      state.playlist.forEach(el => {
        if (el.id === val.id) el = val
      });
    }
  },
  SET_OWNROUTES(state, val) {
    state.ownRoutes = val;
  },
  SET_PAGEACTIVE(state, val) {
    state.pageActive = val
  }
}

const actions = {
  async renderData({ commit, dispatch, state }) {
    try {
      dispatch('recommendList');
      dispatch('privatecontentList');
      dispatch('mvtList');
      dispatch('newsongList');
      dispatch('djprogramList');
    } catch (error) {
      console.log("error", error);
    }

  },
  loginStatus({ commit }) {
    return axios({
      url:
        `/login/status?timerstamp=${Date.now()}`,
      withCredentials: true
    })
      .then(res => {
        console.log("用户登录状态", res.data);
        commit('SET_USERINFO', res.data)
        if (res.code === 200) return res.data
      })
  },
  userLogin({ commit, state }, { account, password }) {
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
        commit('SET_USERINFO', res)
        if (res.code === 200) return res
      })
  },
  //获取用户歌单
  getUserPlaylist({ commit, dispatch, state }, id) {
    return axios({
      url:
        `user/playlist?uid=${id}`
    })
      .then(res => {
        console.log("获取用户歌单", res);
        if (res.code === 200) {
          this.commit("SET_PLAYLIST", res.playlist)
          return res.playlist
        }
      })
  },
  logout({ commit }) {
    return axios({
      url:
        "/logout"
    })
      .then(res => {
        console.log("退出登录", res);
        if (res.code === 200) {
          commit("SET_CLEARSTATE")
          return res
        }
      })
  },
  refresh({ commit, state }) {
    ///刷新登录
    return axios({
      url:
        "/login/refresh"
    })
      .then(res => {
        console.log("res123", res);
      }).catch(err => {
        console.log("error", err);
      })
  },
  //推荐歌单
  recommendList({ commit, state }) {
    axios({
      url:
        "/personalized?limit=9"
    })
      .then(res => {
        console.log("推荐歌单", res);
        if (res.code === 200) {
          commit("SET_PERSONALIZED", res.result)
        }
      })
  },
  //独家放送
  privatecontentList({ commit, state }) {
    axios({
      url:
        "/personalized/privatecontent?limit=4"
    })
      .then(res => {
        console.log("独家放送", res);
        if (res.code === 200) {
          commit("SET_PRIVATECONTENT", res.result)
        }
      })
  },
  //推荐MV
  mvtList({ commit, state }) {
    axios({
      url:
        "/personalized/mv"
    })
      .then(res => {
        console.log("推荐MV", res);
        if (res.code === 200) {
          commit("SET_MVDATA", res.result)
        }
      })
  },
  //推荐新音乐
  newsongList({ commit, state }) {
    axios({
      url:
        "/personalized/newsong"
    })
      .then(res => {
        console.log("推荐新音乐", res);
        if (res.code === 200) {
          commit("SET_NEWSONG", res.result)
        }
      })
  },
  //推荐电台
  djprogramList({ commit, state }) {
    axios({
      url:
        "/personalized/djprogram"
    })
      .then(res => {
        console.log("推荐电台", res);
        if (res.code === 200) {
          commit("SET_DJPROGRAM", res.result)
        }
      })
  },
  getUserDetail({ commit, dispatch, state }) {
    axios({
      url:
        "/user/detail"
    })
      .then(res => {
        console.log("获取用户信息", res);
        if (res.code === 200) {
          commit("SET_USERINFO", res.data)
        }
      })
      .catch(err => {
        dispatch("userLogin")
      });
  },
  clearData({ commit, dispatch, state }) {
    commit('SET_USERINFO', {});
  },
  changeLrcPop({ commit, state }, val) {
    commit('SET_SHOWLRCPOP', val)
  },
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
  getQrcode({ commit }, key) {
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
  getQrCheck({ commit }, key) {
    return axios({
      url:
        `/login/qr/check?key=${key}&timerstamp=${Date.now()}`,
      withCredentials: true,
    })
      .then(res => {
        console.log("校验二维码", res);
        return res
      })
  },
}

export default {
  state,
  mutations,
  actions,
}
