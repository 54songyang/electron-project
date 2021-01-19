<template>
  <div class="list-body" ref="listBody">
    <div class="tab-body" @mousewheel.prevent>
      <div class="tab-box">
        <div
          :class="!tabActive ? 'active' : 'no-acitve'"
          @click="tabActive = false"
        >
          播放列表
        </div>
        <div
          :class="tabActive ? 'active' : 'no-acitve'"
          @click="tabActive = true"
        >
          历史记录
        </div>
      </div>
    </div>
    <div class="title-box" @mousewheel.prevent>
      <div class="total">总18首</div>
      <div class="sc"><i></i>收藏全部</div>
      <div class="delete"><i></i>清空</div>
    </div>
    <div class="list-box" @scroll="scrollFn">
      <div class="scroll-box" ref="scrollBox">
        <div class="list-item" v-for="item in 50" :key="item">
          <div class="music-title ellipsis">赤怜</div>
          <div class="music-singer ellipsis">是二智呀</div>
          <div class="music-link"></div>
          <div class="music-time">04:36</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "musicList",
  data() {
    return {
      tabActive: false,
      scrollTop: "",
    };
  },
  computed: {
    list() {
      return this.$store.state.music.videoUpload.list;
    },
  },
  methods: {
    scrollFn(e) {
      this.scrollTop = e.target.scrollTop;
    },
  },
};
</script>
<style lang="scss" scoped>
.list-body {
  position: fixed;
  top: 51px;
  right: 0;
  width: 420px;
  background: rgb(54, 54, 54);
  z-index: 120;
  height: calc(100% - 110px);
  display: flex;
  flex-direction: column;
  .list-box {
    flex: 1;
    overflow-y: auto;
    .list-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: rgb(185, 185, 185);
      padding: 0 47px 0 20px;
      line-height: 33px;
      height: 33px;
      background: rgb(54, 54, 54);
      &:nth-child(2n) {
        background: rgb(58, 58, 58);
      }
      &:hover {
        background: rgb(62, 62, 62);
        .music-title,
        .music-singer,
        .music-time {
          color: #fff;
        }
      }
      .music-title {
        flex: 1;
      }
      .music-link {
        background: url(~@/assets/images/link.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 15px;
      }
      .music-singer {
        color: rgb(145, 145, 145);
        width: 94px;
      }
      .music-time {
        color: rgb(145, 145, 145);
        text-align: right;
        width: 47px;
      }
      .ellipsis {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
  .tab-body {
    padding: 20px 0 12px 0;
    display: flex;
    justify-content: center;
    .tab-box {
      width: 210px;
      line-height: 30px;
      height: 30px;
      font-size: 14px;
      text-align: center;
      display: flex;
      color: rgb(173, 173, 173);
      border: 1px solid rgb(102, 102, 102);
      border-radius: 15px;
      div {
        flex: 1;
        border-radius: 14px;
        height: 28px;
      }
      .no-acitve:hover {
        background: rgb(62, 62, 62);
        color: #fff;
      }
      .active {
        background: rgb(102, 102, 102);
        color: #fff;
      }
    }
  }
  .title-box {
    display: flex;
    font-size: 14px;
    color: rgb(173, 173, 173);
    justify-content: space-between;
    height: 40px;
    align-items: center;
    border-bottom: 1px solid rgb(64, 64, 64);
    box-sizing: border-box;
    margin-left: 20px;
    .total {
      font-size: 12px;
      color: rgb(91, 91, 91);
      width: 46.2%;
    }
    .sc {
      i {
        display: inline-block;
        background: url(~@/assets/images/sc-all.png) no-repeat;
        background-size: 100% 100%;
        width: 17px;
        height: 17px;
        vertical-align: -3px;
        margin-right: 4px;
      }
    }
    .delete {
      padding-right: 20px;
      i {
        display: inline-block;
        background: url(~@/assets/images/delete-all.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 17px;
        vertical-align: -3px;
        margin-right: 4px;
      }
    }
  }
}
</style>