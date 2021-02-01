<template>
  <div class="player-box">
    <aplayer
      :music="videoUpload.music"
      :shuffle="typeData == 2"
      :repeat="playRepeat"
      ref="player"
    ></aplayer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import aplayer from "./vuePlayer/vue-aplayer";
export default {
  name: "player",
  components: { aplayer },
  data() {
    return {
      player: null,
      typeData: 0,
    };
  },
  computed: {
    playRepeat() {
      if (this.typeData == 0) return "repeat-all";
      if (this.typeData == 1) return "repeat-one";
      return "no-repeat";
    },
    videoUpload() {
      return this.$store.state.music.videoUpload;
    },
  },
  methods:{
    ...mapActions(['canUse','musicUrl']),
  },
  updated() {
    this.player = this.$refs.player;
  },
  mounted(){
    const {active,musicList,music} = this.videoUpload;
    console.log("active",active,musicList,music);
  }
};
</script>

<style lang="scss">
body .player-box {
  position: fixed;
  border-top: 1px solid rgb(35, 35, 35);
  z-index: 500;
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