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
  mainData: {
    personalized: [],//歌单推荐
    privatecontent: [], //独家放送
    mvData: [], //推荐MV
    newsong: [], //推荐新音乐
    djprogram: [], //推荐电台
    bannerList: [],//banner
  },
  playlist: [],//用户歌单
  pageActive: 0,//页面
}

const mutations = {
  SET_CLEARSTATE(state) {
    state.topNav = [
      { name: "个性推荐", path: 'mainPage' },
      { name: "歌单", path: 'songSheet' },
      { name: "主播电台", path: 'djprogram' },
      { name: "排行榜", path: 'rankingList' },
      { name: "歌手", path: 'singer' },
      { name: "最新音乐", path: 'newsong' },
    ]
    state.userInfo = ''
    // state.mainData = {
    //   personalized: [],//歌单推荐
    //   privatecontent: [], //独家放送
    //   mvData: [], //推荐MV
    //   newsong: [], //推荐新音乐
    //   djprogram: [], //推荐电台
    //   bannerList: [],//banner
    // }
    state.playlist = []//用户歌单
    state.pageActive = 0//页面

  },
  SET_USERINFO(state, val) {
    state.userInfo = val;
  },

  SET_PERSONALIZED(state, val) {
    state.mainData.personalized = val;
  },
  SET_PRIVATECONTENT(state, val) {
    state.mainData.privatecontent = val;
  },
  SET_MVDATA(state, val) {
    state.mainData.mvData = val;
  },
  SET_NEWSONG(state, val) {
    state.mainData.newsong = val;
  },
  SET_DJPROGRAM(state, val) {
    state.mainData.djprogram = val;
  },
  SET_BANNER(state, val) {
    state.mainData.bannerList = val
  },

  SET_PLAYLIST(state, val) {
    if (Array.isArray(val)) {
      state.playlist = val
    } else {
      const obj = state.playlist.find(el => el.id === val.id)
      if (obj) {
        for (const key in val) {
          obj[key] = val[key]
        }
      }
    }
  },
  SET_PAGEACTIVE(state, val) {
    state.pageActive = val
  },
}

const actions = {
  setClearState({ commit }, val) {
    commit('SET_CLEARSTATE')
  },
  setUserInfo({ commit }, val) {
    commit('SET_USERINFO', val)
  },
  setDjProgram({ commit }, val) {
    commit('SET_DJPROGRAM', val)
  },
  setPlayList({ commit }, val) {
    commit('SET_PLAYLIST', val)
  },
  setPageActive({ commit }, val) {
    commit('SET_PAGEACTIVE', val)
  },
  setRecommendList({ commit }, val) {
    commit('SET_PERSONALIZED', val)
  },
  setPrivatecontentList({ commit }, val) {
    commit('SET_PRIVATECONTENT', val)
  },
  setMvData({ commit }, val) {
    commit('SET_MVDATA', val)
  },

  getUserDetail({ commit, state }) {
    return axios({
      url:
        `/user/detail?uid=${state.userInfo.account.id}&timerstamp=${Date.now()}`,
      withCredentials: true,
    })
      .then(res => {
        // console.log("获取用户信息", res);
        if (res.code === 200) {
          const newInfo = { ...state.userInfo, ...res }
          commit('SET_USERINFO', newInfo)
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
  
  
  //推荐新音乐
  newsongList({ commit, state }) {
    return axios({
      url:
        "/personalized/newsong"
    })
      .then(res => {
        // console.log("推荐新音乐", res);
        if (res.code === 200) {
          commit("SET_NEWSONG", res.result)
        }
      })
  },
  //推荐电台
  djprogramList({ commit, state }) {
    return axios({
      url:
        "/personalized/djprogram"
    })
      .then(res => {
        // console.log("推荐电台", res);
        if (res.code === 200) {
          commit("SET_DJPROGRAM", res.result)
        }
      })
  },
  //banner
  getBanner({ commit }) {
    return axios({
      type: "get",
      url: `banner?type=0`,
    })
      .then((res) => {
        console.log("banners", res.banners);
        if (res.code === 200) commit('SET_BANNER', res.banners)
      })
  },
}

export default {
  state,
  mutations,
  actions,
}
