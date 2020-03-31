<template>
  <div class="player-box">
    <!-- <aplayer :music="videoUpload.music" :shuffle="typeData == 2" :repeat="playRepeat" ref="player"></aplayer> -->
    <div class="control-middle"></div>
    <div class="control-right">
      <div class="play-btn play-tree"></div>
      <div class="play-btn play-type1" v-show="typeData == 0" @click="typeData=1"></div>
      <div class="play-btn play-type2" v-show="typeData == 1" @click="typeData=2"></div>
      <div class="play-btn play-type3" v-show="typeData == 2" @click="typeData=0"></div>
      <div class="play-btn play-lb"></div>
      <div class="play-btn play-gc"></div>
      <div class="play-btn play-yl"></div>
    </div>
  </div>
</template>

<script>
// import aplayer from "vue-aplayer";
export default {
  name: "player",
  // components: { aplayer },
  data() {
    return {
      videoUpload: {
        progress: false,
        progressPercent: 0,
        successPercent: 0,
        music: {
          title: "Preparation",
          artist: "Hans Zimmer/Richard Harvey",
          list: [
            "https://m801.music.126.net/20200319185848/d38ded5cbe230d057bdef76e442cfcf9/jdyyaac/015c/0f5c/005d/6639bdcc3286aeca31da7742bdc68331.m4a",
            "https://m801.music.126.net/20200319185848/d38ded5cbe230d057bdef76e442cfcf9/jdyyaac/015c/0f5c/005d/6639bdcc3286aeca31da7742bdc68331.m4a"
          ],
          src:
            "https://m801.music.126.net/20200319185848/d38ded5cbe230d057bdef76e442cfcf9/jdyyaac/015c/0f5c/005d/6639bdcc3286aeca31da7742bdc68331.m4a",
          pic:
            "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
          lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
        }
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
  position: relative;
  .aplayer {
    position: relative;
    .aplayer-pic {
      position: initial;
      width: 40px;
      height: 40px;
      top: 2px;
      z-index: 999;
      margin: 10px 0 0 10px;
      .aplayer-play {
        border: none;
        background: rgb(195, 70, 58);
        width: 40px;
        height: 40px;
        .aplayer-icon-play {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    background: rgb(37, 37, 37);
    margin: 0;
    color: #fff;
    .aplayer-info {
      height: 60px;
      padding: 0;
      .aplayer-controller {
        display: block;
        position: absolute;
        top: -4px;
        left: 0;
        width: 100%;
        height: 60px;
        .aplayer-bar-wrap {
          margin-left: 0;
        }
        .aplayer-bar {
          background: rgb(37, 37, 37);
        }
        .aplayer-played {
          background: rgb(224, 57, 56) !important;
          .aplayer-thumb {
            opacity: 0;
          }
        }
        .aplayer-time {
          margin-top: 30px;
          margin-left: 73px;
        }
        .aplayer-loaded {
          background: none;
        }
      }
    }
    .aplayer-volume-wrap,
    .aplayer-icon-mode {
      display: none;
    }
  }
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