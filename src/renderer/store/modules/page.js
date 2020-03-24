import axios from 'axios'
const state = {
  userInfo: '',
}

const mutations = {
  SET_USERINFO(state, val) {
    state.userInfo = val;
  },
}

const actions = {
  async renderData({ commit,dispatch, state }) {
    dispatch('recommendList')
    const loginStatus = await dispatch('loginStatus');
    if(!loginStatus){
      await dispatch('userLogin');
    }else{
      commit("SET_USERINFO",JSON.parse(window.localStorage.getItem('userInfo')))
    }
  },
  loginStatus() {
    if(!localStorage.getItem('userInfo')) return false
    return axios({
      type: "get",
      url:
        "/login/status"
    })
      .then(res => {
        console.log("用户登录状态", res);
        if (res.status === 200&&res.statusText==='OK') {
          return true
        }else{
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
          window.localStorage.setItem('userInfo',JSON.stringify(res.data))
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
          // console.log('res', res.data);
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
  clearData({ commit, dispatch, state }){
    commit('SET_USERINFO',{});
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
