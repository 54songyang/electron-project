<template>
  <div class="mini-body">
    <div class="mini-set-box">
      <div class="mini-close" @click="channelWin('closeMini')"></div>
      <div class="mini-big" @click="channelWin('showMain')"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "miniPage",
  methods: {
    channelWin(val) {
      this.$electron.ipcRenderer.send(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.mini-body {
  position: relative;
  -webkit-app-region: drag;
  background: rgb(47, 47, 47);
  height: 100vh;
  .mini-set-box {
    position: absolute;
    left: 0;
    top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 5px;
    div:hover {
      filter: brightness(2.3);
    }
    .mini-close {
      background: url(~@/assets/images/close1.png) no-repeat;
      background-size: 100% 100%;
      width: 12px;
      height: 12px;
    }
    .mini-big {
      background: url(~@/assets/images/mini-big.png) no-repeat;
      background-size: 100% 100%;
      width: 9px;
      height: 7px;
      margin-top: 5px;
    }
  }
}
</style>