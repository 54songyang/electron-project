import axios from 'axios'
const state = {
  videoUpload: {
    musicList: [], //播放列表
    active: 0,//当前播放index
    activeMenu: 0,//当前使用的歌单
    mini: false, //迷你模式
    showLrcPop: false,//显示歌词窗口
    shuffle: false, //随机播放
    listFolded: false //播放列表
  },
  showMusicList: false//是否显示歌曲列表
}

const mutations = {
  SET_MUSIC(state, { url, lrc }) {
    const active = state.videoUpload.active
    state.videoUpload.musicList[active].src = url
    state.videoUpload.musicList[active].lrc = lrc
  },
  SET_ACTIVE(state, active) {
    state.videoUpload.active = active
  },
  SET_MUSICLIST(state, { musicList, index, activeMenu }) {
    if (musicList) state.videoUpload.musicList = musicList
    if (typeof index === "number" && !isNaN(index)) state.videoUpload.active = index
    if (typeof index === "number" && !isNaN(index)) state.videoUpload.activeMenu = activeMenu
  },
  SET_SHOWMUSICLIST(state, val) {
    //歌曲列表显示隐藏
    state.showMusicList = val
  },
  SET_SHOWLRCPOP(state, val) {
    state.videoUpload.showLrcPop = val;
  },

  SET_videoUpload(state, val) {
    state.videoUpload = {};
  },
  SET_CLEARMUSIC(state, val) {
    state.videoUpload.musicList = []
    state.videoUpload.active = 0
    state.videoUpload.activeMenu = 0
    state.videoUpload.mini = false
    state.videoUpload.showLrcPop = false
    state.videoUpload.shuffle = false
    state.videoUpload.listFolded = false
    state.showMusicList = false//是否显示歌曲列表
  }
}

const actions = {
  canUse({ commit, state }, id) {
    //歌曲是否可用
    return axios({
      url: `/check/music?id=${id}&timerstamp=${Date.now()}`
    }).then(res => {
      console.log("歌曲是否可用", res);
      const { success, message } = res
      return success === true && message === "ok"
    })
  },
  musicUrl({ commit, state }, id) {
    //获取歌曲url
    return axios({
      url: `/song/url?id=${id}&timerstamp=${Date.now()}`
    }).then(res => {
      console.log("获取歌曲url", res);
      return res.data[0]
    })
  },
  musicLrc({ commit, state }, id) {
    //获取歌词
    return axios({
      url: `/lyric?id=${id}&timerstamp=${Date.now()}`
    }).then(res => {
      console.log("获取歌词", res);
      return res.lrc.lyric
    })
  },
  musicDetail({ commit, state }, ids) {
    return axios({
      url: `/song/detail?ids=${ids.join(',')}&timerstamp=${Date.now()}`,
      withCredentials: true,
    }).then(res => {
      console.log("歌曲详情", res.songs);
      return res.songs
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
