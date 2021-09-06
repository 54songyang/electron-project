<template>
  <div class="mini-body">
    <div class="mini-set-box">
      <div class="mini-close" @click="channelWin('closeMini')"></div>
      <div class="mini-big" @click="channelWin('showMain')"></div>
    </div>
    <aplayer :repeat="playRepeat" ref="player"></aplayer>
  </div>
</template>

<script>
import aplayer from "@/components/vuePlayer/mini-aplayer";
export default {
  name: "miniPage",
  components: { aplayer },
  data() {
    return {
      playRepeat: "no-repeat",
    };
  },
  methods: {
    channelWin(val) {
      this.$electron.ipcRenderer.send(val);
    },
  },
};
</script>

<style lang="scss">
.mini-body {
  position: relative;
  -webkit-app-region: drag;
  background: rgb(47, 47, 47);
  height: 100vh;
  overflow: hidden;
  display: flex;
  &:hover {
    .mini-pic-body {
      display: block;
    }
    .aplayer-info {
      .aplayer-music {
        display: none !important;
      }
    }
  }
  .mini-set-box {
    // position: absolute;
    // left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px 5px 0 5px;
    div:hover {
      filter: brightness(2.3);
    }
    .mini-close {
      -webkit-app-region: no-drag;
      background: url(~@/assets/images/close1.png) no-repeat;
      background-size: 100% 100%;
      width: 12px;
      height: 12px;
    }
    .mini-big {
      -webkit-app-region: no-drag;
      background: url(~@/assets/images/mini-big.png) no-repeat;
      background-size: 100% 100%;
      width: 9px;
      height: 7px;
      margin-top: 5px;
    }
  }
}
</style>