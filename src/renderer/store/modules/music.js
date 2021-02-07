import axios from 'axios'
const state = {
  videoUpload: {
    currentMusic: null,//当前播放音乐
    musicList: [], //播放列表
    // active: 0,//当前播放index
    mini: false, //迷你模式
    showLrcPop: false,//显示歌词窗口
    shuffle: false, //随机播放
    listFolded: false //播放列表
  },
  showMusicList: false//是否显示歌曲列表
}
const getters = {
  currentIndex(state) {
    const currentMusic = state.videoUpload.currentMusic
    const musicList = state.videoUpload.musicList
    let index = ""
    for (let i = 0; i < musicList.length; i++) {
      const el = musicList[i];
      if (el.id === currentMusic.id && el.menuId === currentMusic.menuId) {
        index = i
        break
      }
    }
    return index
  }
}
const mutations = {
  SET_MUSIC(state, { url, lrc }) {
    if (url) state.videoUpload.currentMusic.src = url
    if (lrc) {
      state.videoUpload.currentMusic.lrc = lrc
      //todo同时存musicList里的歌词
    }
  },
  SET_ACTIVE(state, active) {
    //!!!
    state.videoUpload.active = active
  },
  SET_MUSICLIST(state, { musicList, currentMusic }) {
    if (musicList) state.videoUpload.musicList = musicList
    state.videoUpload.currentMusic = currentMusic
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
  SET_CLEARMUSIC(state) {
    state.videoUpload.musicList = []
    state.videoUpload.currentMusic = null
    state.videoUpload.mini = false
    state.videoUpload.showLrcPop = false
    state.videoUpload.shuffle = false
    state.videoUpload.listFolded = false
    state.showMusicList = false//是否显示歌曲列表
  },
  SET_LIST(state) {
    //清空播放列表
    state.videoUpload.currentMusic = null
    state.videoUpload.musicList = [];
  }
}

const actions = {
  canUse({ commit, state }, id) {
    //歌曲是否可用
    return new Promise((resolve, reject) => {
      axios({
        url: `/check/music?id=${id}&timerstamp=${Date.now()}`
      }).then(res => {
        const { success, message } = res
        resolve(success === true && message === "ok")
      }).catch(err => {
        console.log("err", err);
        resolve(false)
      })
    })
  },
  musicUrl({ commit, state }, id) {
    //获取歌曲url
    const aa = Array.isArray(id) ? id.join(',') : id;
    return axios({
      url: `/song/url?id=${aa}&timerstamp=${Date.now()}`
    }).then(res => {
      console.log("获取歌曲url", res);
      return res.data
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
  getters
}
