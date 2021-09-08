import axios from 'axios'
import utils from '../utils'
const state = {
  currentMusic: null,//当前播放音乐
  playType: 'PLAY_LIST',//todo播放栏目（播放列表:PLAY_LIST，私人FM:OWN_FM等）
  musicList: [], //播放列表
  mini: false, //迷你模式
  isPlaying: false,//是否在播放
  showLrcPop: false,//显示歌词窗口
  shuffle: false, //随机播放
  playOrder: [],//播放顺序
  repeatType: 'no-repeat',//随机模式:no-repeat,repeat-one,repeat-all,repeat-random
  listFolded: false, //播放列表
  volume: 0.5,//音量 value >= 0 && value <= 1;
  showMusicList: false//是否显示歌曲列表
}
const getters = {
  currentIndex(state) {
    const currentMusic = state.currentMusic
    if (!currentMusic) return ''
    const musicList = state.musicList
    let index = ""
    for (let i = 0; i < musicList.length; i++) {
      const el = musicList[i];
      if (el.id === currentMusic.id && el.menuId === currentMusic.menuId) {
        index = i
        break
      }
    }
    return index
  },
  internalVolume(state) {
    if (state.volume < 0) return 0;
    else if (state.volume > 1) return 1;
    else return state.volume
  }
}
const mutations = {
  SET_MUSIC(state, { url, lrc }) {
    if (url) state.currentMusic.src = url
    if (lrc) {
      state.currentMusic.lrc = lrc
      //todo同时存musicList里的歌词
    }
  },
  SET_VOLUUME(state, val) {
    state.volume = val;
  },
  SET_PLAYING(state, val) {
    state.isPlaying = val
  },
  SET_MUSICLIST(state, { musicList, currentMusic, playType }) {
    if (musicList) state.musicList = musicList
    if (playType === "OWN_FM") {
      state.playType = "OWN_FM"
    } else {
      state.playType = "PLAY_LIST" //***播放歌曲列表模式
    }
    state.currentMusic = currentMusic
  },
  SET_SHOWMUSICLIST(state, val) {
    //歌曲列表显示隐藏
    state.showMusicList = val
  },
  SET_SHOWLRCPOP(state, val) {
    state.showLrcPop = val;
  },
  SET_CLEARMUSIC(state) {
    state.musicList = []
    // state.currentMusic = null
    state.mini = false
    state.showLrcPop = false
    state.shuffle = false
    state.listFolded = false
    state.showMusicList = false//是否显示歌曲列表
    state.volume = 0.5
    state.playOrder = []
    state.musicList = [];
  },
  SET_LIST(state) {
    //清空播放列表
    // state.currentMusic = null
    state.musicList = [];
  },
  SET_REPEATTYPE(state, val) {
    state.repeatType = val;
  },
  SET_PLAYORDER(state, val) {
    state.playOrder = val;
  },
  SET_PLAYTYPE(state, val) {
    state.playType = val;
  }
}

const actions = {
  setMusic({ commit }, val) {
    commit('SET_MUSIC', val)
  },
  setVoluume({ commit }, val) {
    commit('SET_VOLUUME', val)
  },
  setPlaying({ commit }, val) {
    commit('SET_PLAYING', val)
  },
  setMusicList({ commit }, val) {
    commit('SET_MUSICLIST', val)
  },
  setShowMusicList({ commit }, val) {
    commit('SET_SHOWMUSICLIST', val)
  },
  setShowLrcPop({ commit }, val) {
    commit('SET_SHOWLRCPOP', val)
  },
  setList({ commit }, val) {
    commit('SET_LIST', val)
  },
  setClearMusic({ commit }, val) {
    console.log("3",);
    commit('SET_CLEARMUSIC', val)
  },

  setRepeatType({ state, commit, getters }) {
    let arr = [];
    if (state.repeatType === 'no-repeat') {
      commit('SET_REPEATTYPE', "repeat-all")
      arr = [...Array(state.musicList.length).keys()]
    } else if (state.repeatType === "repeat-all") {
      commit('SET_REPEATTYPE', "repeat-one")
      arr = [...Array(state.musicList.length).keys()]
    } else if (state.repeatType === "repeat-random") {
      commit('SET_REPEATTYPE', 'no-repeat')
      arr = [...Array(state.musicList.length).keys()]
    } else if (state.repeatType === "repeat-one") {
      const total = state.musicList.length;
      const num = Number(getters.currentIndex)
      arr = utils.selectRandom(total);
      const i = arr.indexOf(num);
      arr.splice(i, 1);
      arr.push(num);
      commit('SET_REPEATTYPE', "repeat-random")
    }
    commit('SET_PLAYORDER', arr)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
