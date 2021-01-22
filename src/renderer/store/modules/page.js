import axios from 'axios'
axios.defaults.baseURL = "http://www.await.site/music/";
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
  showLrcPop: false,//显示歌词窗口
  pageActive: 0,//页面
}

const mutations = {
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
      type: "get",
      url:
        "/login/status"
    })
      .then(res => {
        console.log("用户登录状态", res.data);
        return res.data
      })
  },
  userLogin({ commit, state }) {
    return axios({
      type: "get",
      url:
        "/login?email=m13522499772@163.com&password=songyang123"
    })
      .then(res => {
        console.log("用户登录", res);
        if (res.code === 200) return res
      })
  },
  refresh({ commit, state }) {
    ///刷新登录
    return axios({
      type: "get",
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
      type: "get",
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
      type: "get",
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
      type: "get",
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
      type: "get",
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
      type: "get",
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
      type: "get",
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
  //获取用户歌单
  getUserPlaylist({ commit, dispatch, state }, id) {
    return axios({
      type: "get",
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
}

export default {
  state,
  mutations,
  actions,
}
