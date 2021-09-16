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
      <div class="total">总{{ musicList.length }}首</div>
      <div class="sc"><i></i>收藏全部</div>
      <div class="delete" @click="clearList"><i></i>清空</div>
    </div>
    <div
      class="list-box"
      v-if="Array.isArray(musicList) && musicList.length > 0"
      @scroll="scrollFn"
    >
      <div class="scroll-box" ref="scrollBox">
        <div
          :class="[
            'list-item',
            {
              'active-music':
                currentMusic &&
                item.id === currentMusic.id &&
                item.menuId === currentMusic.menuId,
            },
            { 'active-item': activeItem === index },
            `music-list${index}`,
          ]"
          v-for="(item, index) in musicList"
          :key="item.id + '' + index"
          @dblclick="selectsong(item, index)"
          @click="selectItem(index)"
          @contextmenu.prevent="rightClick(item)"
        >
          <div class="music-title ellipsis">
            <div :class="['music-type', isPlaying ? 'playing' : 'pause']"></div>
            <span>{{ item.name }}</span>
            <span class="name-tip ellipsis" v-if="item.alia.length > 0"
              ><em>({{ item.alia.join("/") }})</em></span
            >
            <span class="sq"></span>
            <span class="mv" v-if="item.mv"></span>
          </div>
          <div class="music-singer ellipsis">
            {{ item.ar.map((el) => el.name).join("/") }}
          </div>
          <div class="music-link"></div>
          <div class="music-time">{{ item.dt | durationFilter }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { remote } from "electron";
const { Menu, MenuItem } = remote;
export default {
  name: "musicList",
  data() {
    return {
      tabActive: false,
      scrollTop: "",
      activeItem: "",
    };
  },
  computed: {
    musicList() {
      return this.$store.state.music.musicList;
    },
    currentMusic() {
      return this.$store.state.music.currentMusic;
    },
    isPlaying() {
      //是否在播放
      return this.$store.state.music.isPlaying;
    },
  },
  methods: {
    ...mapActions(["setList", "setMusicList"]),
    scrollFn(e) {
      this.scrollTop = e.target.scrollTop;
    },
    clearList() {
      //清空当前音乐,清空播放列表
      this.setList();
    },
    rightClick(item) {
      const _this = this;
      const arr = [
        {
          label: "播放",
          click: function () {
            _this.selectsong(item);
          },
        },
        {
          label: "查看评论",
          enabled: false, //false不可点击
          click: function () {
            console.log("查看评论");
          },
        },
        {
          label: "下一首播放",
          click: function () {
            console.log("下一首播放");
          },
        },
        {
          type: "separator", //checkbox,radio
        },
        {
          label: "收藏",
          submenu: [
            {
              label: "创建新歌单",
              click: function () {
                console.log("创建新歌单");
              },
            },
            {
              type: "separator", //checkbox,radio
            },
          ],
        },
        {
          label: "分享...",
          click: function () {
            console.log("分享...");
          },
        },
        {
          label: "复制链接",
          click: function () {
            console.log("复制链接");
          },
        },
        {
          label: "下载",
          click: function () {
            console.log("下载");
          },
        },
        {
          type: "separator",
        },
        {
          label: "重歌单中删除",
          click: function () {
            console.log("从歌单中删除");
          },
        },
      ];
      // 右键菜单
      const list = this.$store.state.page.playlist;
      const mm = list.map((el) => ({
        el,
        label: el.name,
        click: function () {
          console.log(el.name);
        },
      }));
      arr[4].submenu = [...arr[4].submenu, ...mm];
      const menu = new Menu();
      arr.forEach((el) => {
        menu.append(new MenuItem(el));
      });
      // 展示出来
      menu.popup(remote.getCurrentWindow());
    },
    selectItem(index) {
      this.activeItem = index;
    },
    async selectsong(item, index) {
      this.setMusicList({
        currentMusic: { ...item },
      });
    },
  },
  filters: {
    durationFilter(a) {
      a = a / 1000;
      let b = "";
      let h = parseInt(a / 36000),
        m = parseInt((a % 3600) / 60),
        s = parseInt((a % 3600) % 60);
      if (h > 0) {
        h = h < 10 ? "0" + h : h;
        b += h + ":";
      }
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      b += m + ":" + s;
      return b;
    },
  },
  mounted() {
    console.log("---", this.currentMusic);
    console.log("---", this.musicList);
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
  box-shadow: -10px 0px 20px -20px #000000;
  .list-box {
    flex: 1;
    overflow-y: auto;
    .list-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: rgb(185, 185, 185);
      padding: 0 47px 0 0px;
      line-height: 33px;
      height: 33px;
      background: rgb(54, 54, 54);
      &:nth-child(2n) {
        background: rgb(58, 58, 58);
      }
      &:not(.active-music):hover {
        background: rgb(62, 62, 62);
        .music-title,
        .music-singer,
        .music-time {
          color: #fff;
        }
      }
      .music-title {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 10px;
        .music-type {
          width: 20px;
          min-width: 20px;
          height: 33px;
        }
        .name-tip {
          display: inline-block;
          color: rgb(172, 172, 172);
          font-size: 10px;
          margin-left: 4px;
          em {
            font-size: 12px;
            color: rgb(90, 90, 90);
          }
        }
        .sq {
          display: block;
          background: url(~@/assets/images/sq-2.png) no-repeat;
          background-size: 100% 100%;
          width: 15px;
          height: 12px;
          min-width: 17px;
          margin: 0 4px;
        }
        .mv {
          display: block;
          background: url(~@/assets/images/video-red.png) no-repeat;
          background-size: 100% 100%;
          width: 16px;
          height: 15px;
          min-width: 17px;
          margin: 0 4px;
        }
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
        color: rgb(91, 91, 91);
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
    .active-item {
      background: rgb(51, 51, 51) !important;
    }
    .active-music {
      .music-title {
        color: rgb(187, 69, 57);
        .music-type {
          &.playing {
            background: url(~@/assets/images/play-l.png) center center no-repeat;
            background-size: 7px 7px;
          }
          &.pause {
            background: url(~@/assets/images/zt-l.png) center center no-repeat;
            background-size: 7px 7px;
          }
        }
      }
      .music-singer {
        color: rgb(187, 69, 57);
      }
    }
  }
  .tab-body {
    padding: 20px 0 12px 0;
    display: flex;
    justify-content: center;
    .tab-box {
      width: 210px;
      line-height: 28px;
      height: 28px;
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