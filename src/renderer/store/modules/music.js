import axios from 'axios'
const state = {
  videoUpload: {
    // progress: false,
    // progressPercent: 0,
    // successPercent: 0,
    // theme: "#c3463a",
    music: {
      title: "赤怜",
      artist: "是二智呀",
      src:
        "http://m7.music.126.net/20210121211438/12fa2d860102ca4673a8a54fdf4c40d4/ymusic/510b/5659/5253/fa20f19cd2a3a06597c6e9cfba8527a4.mp3",
      // src:
      //   "http://m8.music.126.net/20210121211438/6e8b4da88f40c6dcea784cf2aa8a2e3c/ymusic/daaf/11ae/a776/28f48fa20efcfee75c4d348ab69a5797.mp3",
      pic:
        "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
      lrc: "[00:00.000] 作曲 : 一博/张池\n[00:01.000] 作词 : 一博\n[00:06.31]编曲：朴天滢\n[00:18.02]我踏破了江边望穿思念离人在两端\n[00:23.64]篝火暗淡天色正晚惜别在渔船\n[00:29.21]回忆湿人眼\n[00:31.60]旧梦情 断琴弦\n[00:34.16]恰逢人幽怨 又遇雨天\n[00:40.21]我看透了世间离合悲欢相聚又走散\n[00:45.84]放手不甘回头太难留恋总无言\n[00:51.37]纠缠的华年\n[00:53.64]匆匆揉 碎容颜\n[00:56.64]五岳茫茫 四海难相见\n[01:01.89]夜色人未走\n[01:04.56]执手相望饮一口\n[01:07.44]煮下醉仙酒\n[01:10.17]绯红妆容似锦绣\n[01:12.98]夜尽人未休\n[01:15.71]从此天涯各自走\n[01:18.56]千丝怨 万缕愁\n[01:21.27]望西楼\n[01:47.02]我看透了世间离合悲欢相聚又走散\n[01:52.61]放手不甘回头太难留恋总无言\n[01:58.06]纠缠的华年\n[02:00.34]匆匆揉 碎容颜\n[02:03.08]五岳茫茫 四海难相见\n[02:08.77]夜色人未走\n[02:11.36]执手相望饮一口\n[02:14.09]煮下醉仙酒\n[02:16.82]绯红妆容似锦绣\n[02:19.69]夜尽人未休\n[02:22.43]从此天涯各自走\n[02:25.24]千丝怨 万缕愁\n[02:28.02]望西楼\n[02:30.78]夜色人未走\n[02:33.54]执手相望饮一口\n[02:36.34]煮下醉仙酒\n[02:39.19]绯红妆容似锦绣\n[02:41.94]夜尽人未休\n[02:44.68]从此天涯各自走\n[02:47.45]千丝怨 万缕愁\n[02:50.24]望西楼\n[02:53.06]不妄人 苦等候\n[02:55.73]再回眸\n[03:15.03]混音：张丁予\n[03:16.75]和声：张丁予，小嗯，一博\n[03:17.21]录音：宫成\n[03:18.62]发行：桂吴迪\n[03:19.04]OP：海茗音乐\n"
    },
    list: [
      {
        title: "1",
        artist: "3",
        src:
          "http://m7.music.126.net/20210121211438/12fa2d860102ca4673a8a54fdf4c40d4/ymusic/510b/5659/5253/fa20f19cd2a3a06597c6e9cfba8527a4.mp3",
        pic:
          "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
        lrc: "[00:00.000] 作曲 : 一博/张池\n[00:01.000] 作词 : 一博\n[00:06.31]编曲：朴天滢\n[00:18.02]我踏破了江边望穿思念离人在两端\n[00:23.64]篝火暗淡天色正晚惜别在渔船\n[00:29.21]回忆湿人眼\n[00:31.60]旧梦情 断琴弦\n[00:34.16]恰逢人幽怨 又遇雨天\n[00:40.21]我看透了世间离合悲欢相聚又走散\n[00:45.84]放手不甘回头太难留恋总无言\n[00:51.37]纠缠的华年\n[00:53.64]匆匆揉 碎容颜\n[00:56.64]五岳茫茫 四海难相见\n[01:01.89]夜色人未走\n[01:04.56]执手相望饮一口\n[01:07.44]煮下醉仙酒\n[01:10.17]绯红妆容似锦绣\n[01:12.98]夜尽人未休\n[01:15.71]从此天涯各自走\n[01:18.56]千丝怨 万缕愁\n[01:21.27]望西楼\n[01:47.02]我看透了世间离合悲欢相聚又走散\n[01:52.61]放手不甘回头太难留恋总无言\n[01:58.06]纠缠的华年\n[02:00.34]匆匆揉 碎容颜\n[02:03.08]五岳茫茫 四海难相见\n[02:08.77]夜色人未走\n[02:11.36]执手相望饮一口\n[02:14.09]煮下醉仙酒\n[02:16.82]绯红妆容似锦绣\n[02:19.69]夜尽人未休\n[02:22.43]从此天涯各自走\n[02:25.24]千丝怨 万缕愁\n[02:28.02]望西楼\n[02:30.78]夜色人未走\n[02:33.54]执手相望饮一口\n[02:36.34]煮下醉仙酒\n[02:39.19]绯红妆容似锦绣\n[02:41.94]夜尽人未休\n[02:44.68]从此天涯各自走\n[02:47.45]千丝怨 万缕愁\n[02:50.24]望西楼\n[02:53.06]不妄人 苦等候\n[02:55.73]再回眸\n[03:15.03]混音：张丁予\n[03:16.75]和声：张丁予，小嗯，一博\n[03:17.21]录音：宫成\n[03:18.62]发行：桂吴迪\n[03:19.04]OP：海茗音乐\n"
      },
      {
        title: "2",
        artist: "4",
        src:
          "http://m8.music.126.net/20210121211438/6e8b4da88f40c6dcea784cf2aa8a2e3c/ymusic/daaf/11ae/a776/28f48fa20efcfee75c4d348ab69a5797.mp3",
        pic:
          "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
        lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
      },
    ],
    active: 0,//当前播放index
    mini: false, //迷你模式
    showLrc: true, //是否显示歌词
    shuffle: false, //随机播放
    listFolded: false //播放列表
  },
  showMusicList: false//是否显示歌曲列表
}

const mutations = {
  SET_MUSIC(state, index) {
    //设置当前播放音乐
    console.log("00",state.videoUpload.list[index]);
    state.videoUpload.music = state.videoUpload.list[index]
    state.videoUpload.active = index
  },
  SET_MUSIC_LIST(state, val) {
    //设置播放列表
  },
  SET_SHOWMUSICLIST(state, val) {
    //歌曲列表显示隐藏
    state.showMusicList = val
  }
}

const actions = {
  canUse({ commit, state },id) {
    //歌曲是否可用
    return axios({
      type: 'get',
      url: `/check/music?id=${id}`
    }).then(res => {
      console.log("resa",res);
      const { success, message } = res
      return success === true && message === "ok"
    })
  },
  musicUrl({ commit, state },id) {
    //获取歌曲url
    return axios({
      type: 'get',
      url: `/song/url?id=${id}`
    }).then(res => {
      console.log("resb",res);
      return res.data[0]
    })
  },
  musicLrc({ commit, state },id) {
    //获取歌词
    return axios({
      type: 'get',
      url: `/lyric?id=${id}`
    }).then(res => {
      console.log("resc",res);
      return res.lrc.lyric      
    })
  },
  musicDetail({ commit, state },id){
    return axios({
      type: 'get',
      url: `/song/detail?ids=${id}`
    }).then(res => {
      console.log("resd",res.songs[0]);
      return res.songs[0]
    })
  },
      // [405998841,33894312]

  async checkMusic({ dispatch },id) {
    //选择音乐
    try {
      const use = await dispatch("canUse",id)
      const detail = await dispatch("musicDetail",id)
      const murl = await dispatch("musicUrl",id)
      const lrc = await dispatch("musicLrc",id)
      // console.log("00",a,b,c,d);
    let obj = {
      artist:'',
      name:detail.name,
      pic:detail.al.picUrl,
      url:murl.url,
      lrc
    }
    console.log("obj",obj);
    } catch (error) {
      console.log("error",error);
    }
  }
}

export default {
  state,
  mutations,
  actions,
}
