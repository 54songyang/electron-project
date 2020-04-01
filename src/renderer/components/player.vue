<template>
  <div class="player-box">
    <aplayer :music="videoUpload.music" :shuffle="typeData == 2" :repeat="playRepeat" ref="player"></aplayer>
    <div class="control-middle"></div>
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
            "http://m7.music.126.net/20200401111828/99e46bd518043bdc7a1c865645be7a98/ymusic/f3fb/235e/a216/2f95cb16b58562445a95eadda702952d.mp3",
          pic:
            "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
          lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
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
        showLrc:false, //是否显示歌词
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