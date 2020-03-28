import axios from 'axios'
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
}

const actions = {
  async renderData({ commit, dispatch, state }) {
    dispatch('recommendList');
    dispatch('privatecontentList');
    dispatch('mvtList');
    dispatch('newsongList');
    dispatch('djprogramList');
    const loginStatus = await dispatch('loginStatus');
    if (!loginStatus) {
      await dispatch('userLogin');
    } else {
      commit("SET_USERINFO", JSON.parse(window.localStorage.getItem('userInfo')))
    }
  },
  loginStatus() {
    if (!localStorage.getItem('userInfo')) return false
    return axios({
      type: "get",
      url:
        "/login/status"
    })
      .then(res => {
        console.log("用户登录状态", res);
        if (res.status === 200 && res.statusText === 'OK') {
          return true
        } else {
          return false
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  },
  userLogin({ commit, state }) {
    return axios({
      type: "get",
      url:
        "login/cellphone?phone=13522499772&password=s459992561"
    })
      .then(res => {
        console.log("用户登录", res);
        if (res.status === 200) {
          console.log('res', res.data);
          commit("SET_USERINFO", res.data);
          window.localStorage.setItem('userInfo', JSON.stringify(res.data))
        }
      })
      .catch(err => {
        console.log("err", err);
      });
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
        if (res.status === 200) {
          commit("SET_PERSONALIZED", res.data.result)
        }
      })
      .catch(err => {
        console.log("err", err);
      });
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
        if (res.status === 200) {
          commit("SET_PRIVATECONTENT", res.data.result)
        }
      })
      .catch(err => {
        console.log("err", err);
      });
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
        if (res.status === 200) {
          commit("SET_MVDATA", res.data.result)
        }
      })
      .catch(err => {
        console.log("err", err);
      });
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
        if (res.status === 200) {
          commit("SET_NEWSONG", res.data.result)
        }
      })
      .catch(err => {
        console.log("err", err);
      });
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
        if (res.status === 200) {
          commit("SET_DJPROGRAM", res.data.result)
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  },
  getUserDetail({ commit, dispatch, state }) {
    axios({
      type: "get",
      url:
        "/user/detail"
    })
      .then(res => {
        console.log("获取用户信息", res);
        if (res.status === 200) {
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
  // getUserInfo({ commit, dispatch, state }) {
  //   axios({
  //     type: "get",
  //     url:
  //       "user/subcount"
  //   })
  //     .then(res => {
  //       console.log("获取用户信息", res);
  //       if (res.status === 200) {
  //         commit("SET_USERINFO", res.data)
  //       }
  //     })
  //     .catch(err => {
  //       dispatch("userLogin")
  //     });
  // },
}

export default {
  state,
  mutations,
  actions,
}
