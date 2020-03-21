import axios from 'axios'

const state = {
  userInfo: '',
}

const mutations = {
  SET_USERINFO(state, val) {
    state.userInfo = val;
  }
}

const actions = {
  getUserInfo({ commit, state }) {
    axios({
      type: "get",
      url:
        "http://localhost:3000/login/cellphone?phone=13522499772&password=s459992561"
    })
      .then(res => {
        console.log("res", res);
        if (res.status === 200) {
          commit("SET_USERINFO", res.data)
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  },
}

export default {
  state,
  mutations,
  actions,
}
