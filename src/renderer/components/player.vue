<template>
  <div class="player-box">
    <aplayer :music="videoUpload.music" :shuffle="typeData == 2" :repeat="playRepeat" ref="player"></aplayer>
  </div>
</template>

<script>
import aplayer from "./vuePlayer/vue-aplayer";
export default {
  name: "player",
  components: { aplayer },
  data() {
    return {
      videoUpload: {
        // progress: false,
        // progressPercent: 0,
        // successPercent: 0,
        // theme: "#c3463a",
        music: {
          title: "산다는 건 (Cheer Up)",
          artist: "洪真英",
          src:
            "http://m8.music.126.net/20200403185455/0d53f3e587cad0d6d553cd360da02894/ymusic/050b/535b/530c/2ad2f77d23d15443e4fcdf25a0cf593c.mp3",
          pic:
            "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
          lrc: "[00:00.000] 作曲 : 一博/张池\n[00:01.000] 作词 : 一博\n[00:06.31]编曲：朴天滢\n[00:18.02]我踏破了江边望穿思念离人在两端\n[00:23.64]篝火暗淡天色正晚惜别在渔船\n[00:29.21]回忆湿人眼\n[00:31.60]旧梦情 断琴弦\n[00:34.16]恰逢人幽怨 又遇雨天\n[00:40.21]我看透了世间离合悲欢相聚又走散\n[00:45.84]放手不甘回头太难留恋总无言\n[00:51.37]纠缠的华年\n[00:53.64]匆匆揉 碎容颜\n[00:56.64]五岳茫茫 四海难相见\n[01:01.89]夜色人未走\n[01:04.56]执手相望饮一口\n[01:07.44]煮下醉仙酒\n[01:10.17]绯红妆容似锦绣\n[01:12.98]夜尽人未休\n[01:15.71]从此天涯各自走\n[01:18.56]千丝怨 万缕愁\n[01:21.27]望西楼\n[01:47.02]我看透了世间离合悲欢相聚又走散\n[01:52.61]放手不甘回头太难留恋总无言\n[01:58.06]纠缠的华年\n[02:00.34]匆匆揉 碎容颜\n[02:03.08]五岳茫茫 四海难相见\n[02:08.77]夜色人未走\n[02:11.36]执手相望饮一口\n[02:14.09]煮下醉仙酒\n[02:16.82]绯红妆容似锦绣\n[02:19.69]夜尽人未休\n[02:22.43]从此天涯各自走\n[02:25.24]千丝怨 万缕愁\n[02:28.02]望西楼\n[02:30.78]夜色人未走\n[02:33.54]执手相望饮一口\n[02:36.34]煮下醉仙酒\n[02:39.19]绯红妆容似锦绣\n[02:41.94]夜尽人未休\n[02:44.68]从此天涯各自走\n[02:47.45]千丝怨 万缕愁\n[02:50.24]望西楼\n[02:53.06]不妄人 苦等候\n[02:55.73]再回眸\n[03:15.03]混音：张丁予\n[03:16.75]和声：张丁予，小嗯，一博\n[03:17.21]录音：宫成\n[03:18.62]发行：桂吴迪\n[03:19.04]OP：海茗音乐\n"
        },
        list: [
          {
            title: "산다는 건 (Cheer Up)",
            artist: "洪真英",
            src:
              "http://m8.music.126.net/20200401111828/72bcdf3a572ab1a64c605eb9c74b1eb9/ymusic/0fd6/4f65/43ed/a8772889f38dfcb91c04da915b301617.mp3",
            pic:
              "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
            lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
          },
          {
            title: "456",
            artist: "123",
            src:
              "http://m7.music.126.net/20200401111828/99e46bd518043bdc7a1c865645be7a98/ymusic/f3fb/235e/a216/2f95cb16b58562445a95eadda702952d.mp3",
            pic:
              "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
            lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
          }
        ],
        mini:false, //迷你模式
        showLrc:true, //是否显示歌词
        shuffle:false, //随机播放
        listFolded:false //播放列表
      },
      player: null,
      typeData: 0
    };
  },
  computed: {
    playRepeat() {
      if (this.typeData == 0) return "repeat-all";
      if (this.typeData == 1) return "repeat-one";
      return "no-repeat";
    }
  },
  updated() {
    this.player = this.$refs.player;
  },
  methods: {}
};
</script>

<style lang="scss">
body .player-box {
  position: fixed;
  border-top: 1px solid rgb(35, 35, 35);
  z-index: 100;
  width: 100%;
  .control-right {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    right: 20px;
    display: flex;
    align-items: center;
    .play-btn {
      margin: 0 10px;
      flex: 1;
      width: 18px;
      height: 18px;
    }
    .play-type1 {
      background: url(~@/assets/images/xh.png) no-repeat;
      background-size: 100% 100%;
    }
    .play-type2 {
      background: url(~@/assets/images/dq.png) no-repeat;
      background-size: 100% 100%;
    }
    .play-type3 {
      background: url(~@/assets/images/sj.png) no-repeat;
      background-size: 100% 100%;
    }
    .play-yl {
      background: url(~@/assets/images/yl.png) no-repeat;
      background-size: 100% 100%;
    }
    .play-gc {
      background: url(~@/assets/images/gc.png) no-repeat;
      background-size: 100% 100%;
    }
    .play-tree {
      background: url(~@/assets/images/tree.png) no-repeat;
      background-size: 100% 100%;
    }
    .play-lb {
      background: url(~@/assets/images/lb.png) no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>