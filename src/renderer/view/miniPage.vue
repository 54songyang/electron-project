<template>
  <div class="mini-body">
    <div :class="['music-box', miniSpread && 'spread-mini']">
      <div class="mini-main-body">
        <div class="mini-set-box">
          <div class="set-body">
            <div class="mini-close" @click="channelWin('closeMini')"></div>
            <div class="mini-big" @click="channelWin('showMain')"></div>
          </div>
          <div class="title-body">
            <div>{{ currentMusic ? currentMusic.name : "" }}</div>
            <div>
              {{
                currentMusic && currentMusic.ar
                  ? currentMusic.ar.map((el) => el.name).join("/")
                  : ""
              }}
              <i>--</i>
              {{ currentMusic && currentMusic.al ? currentMusic.al.name : "" }}
            </div>
          </div>
          <div @click="rightClick" class="set-more">
            <img src="@/assets/images/more.png" alt="" />
          </div>
        </div>
        <div class="main-part"></div>
        <div class="mini-aplayer">
          <div class="flex-box">
            <div class="aplayer-img-box" @click="miniSpreadFn">
              <i :class="[showLrcPop ? 'retract-pop' : 'open-pop']"></i>
              <div class="blur-box">
                <img
                  v-lazy="{
                    src:
                      currentMusic && currentMusic.al
                        ? currentMusic.al.picUrl
                        : '',
                    error: defaultImg1,
                  }"
                  alt
                />
              </div>
            </div>
            <div class="aplayer-control-box">
              <div class="music-info">
                <div class="aplayer-music">
                  <span class="aplayer-title">{{
                    currentMusic ? currentMusic.name : ""
                  }}</span>
                  <span class="aplayer-author">
                    {{
                      currentMusic && currentMusic.ar
                        ? currentMusic.ar.map((el) => el.name).join("/")
                        : ""
                    }}
                    <i>--</i>
                    {{
                      currentMusic && currentMusic.al
                        ? currentMusic.al.name
                        : ""
                    }}
                  </span>
                </div>
              </div>
              <div class="play-box">
                <div>
                  <div class="prev" @click="prev"></div>
                  <div
                    class="aplayer-button"
                    :class="isPlaying ? 'aplayer-pause' : 'aplayer-play'"
                    @click="onClick"
                    @keydown.space="onClick"
                  >
                    <div
                      :class="
                        isPlaying ? 'aplayer-icon-pause' : 'aplayer-icon-play'
                      "
                    ></div>
                  </div>
                  <div class="next" @click="next"></div>
                </div>
              </div>
            </div>
            <div class="aplayer-other-box">
              <div class="sc"></div>
              <div class="tj" @click="showListFn"></div>
              <div :class="showLrc ? 'red' : 'xz'" @click="showLrcFn"></div>
              <div class="fx" @click="adjustVolume"></div>
            </div>
          </div>
          <div
            class="aplayer-progress-box"
            ref="barWrap"
            @mousedown="onThumbMouseDown"
            @touchstart="onThumbTouchStart"
          >
            <div
              class="aplayer-bar"
              :style="{ width: `${loadProgress * 100}%` }"
            ></div>
            <div
              class="aplayer-played"
              :style="{ width: `${playProgress * 100}%` }"
            >
              <span
                ref="thumb"
                @mouseover="thumbHovered = true"
                @mouseout="thumbHovered = false"
                class="aplayer-thumb"
              >
                <span class="aplayer-loading-icon"> </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="aplayer-big-box" v-show="miniSpread">
        <div class="bg-img-box">
          <img
            :class="showLrc && 'show-lrc-img'"
            v-lazy="{
              src:
                currentMusic && currentMusic.al ? currentMusic.al.picUrl : '',
              error: defaultImg2,
            }"
            alt
          />
        </div>
        <div class="music-lrc" v-show="showLrc">
          <lyrics
            ref="lyrics"
            v-show="currentMusic && currentMusic.lrc"
            :play-stat="playStat"
            :isMini="true"
          />
          <div class="no-lrc" v-show="currentMusic && !currentMusic.lrc">
            网易云音乐
          </div>
        </div>
      </div>
    </div>
    <div class="play-list-box">
      <div class="scroll-box">
        <div
          :class="[
            'play-item',
            { 'active-item': activeItem === index },
            {
              'active-music':
                currentMusic &&
                item.id === currentMusic.id &&
                item.menuId === currentMusic.menuId,
            },
          ]"
          v-for="(item, index) in musicList"
          :key="item.id + '' + index"
          @dblclick="selectsong(item, index)"
          @click="selectItem(index)"
        >
          <div class="word-box">
            {{ item.name
            }}<span v-show="item.alia.length > 0"
              >({{ item.alia.join(",") }}})</span
            >
          </div>
          <i class="more" @click.stop="rightClick"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";
const { Menu, MenuItem } = remote;
import defaultImg1 from "@/assets/images/mini/mini-1.png";
import { mapActions } from "vuex";
import defaultImg2 from "@/assets/images/mini/mini-8.png";
import Lyrics from "@/components/vuePlayer/components/aplayer-lrc";
export default {
  name: "miniPage",
  components: { Lyrics },
  data() {
    return {
      playRepeat: "no-repeat",
      defaultImg1,
      defaultImg2,
      hasMovedSinceMouseDown: false,
      dragStartX: 0,
      dragStartY: 0,
      thumbHovered: false,
      miniSpread: false, //放大窗口
      showLrc: false, //展示歌词
      showList: false, //展示列表
      activeItem: "",
    };
  },
  computed: {
    currentMusic() {
      return this.$store.state.music.currentMusic;
    },
    showLrcPop() {
      return this.$store.state.music.showLrcPop;
    },
    isPlaying() {
      return this.$store.state.music.isPlaying;
    },
    currentIndex() {
      return this.$store.getters.currentIndex;
    },
    musicList() {
      return this.$store.state.music.musicList;
    },
    repeatType() {
      return this.$store.state.music.repeatType;
    },
    playOrder() {
      return this.$store.state.music.playOrder;
    },
    playStat() {
      return this.$store.state.music.playStat;
    },
    playProgress() {
      if (this.playStat.duration === 0) return 0;
      return this.playStat.playedTime / this.playStat.duration;
    },
    loadProgress() {
      if (this.playStat.duration === 0) return 0;
      return this.playStat.loadedTime / this.playStat.duration;
    },
  },
  methods: {
    channelWin(val) {
      this.$electron.ipcRenderer.send(val);
    },
    ...mapActions(["setMusicList"]),
    miniSpreadFn() {
      if (this.miniSpread) {
        if (this.showList) {
          remote.getCurrentWindow().setSize(335, 250);
        } else {
          remote.getCurrentWindow().setSize(335, 50);
        }
      } else {
        if (this.showList) {
          remote.getCurrentWindow().setSize(335, 535);
        } else {
          remote.getCurrentWindow().setSize(335, 335);
          // remote.getCurrentWindow().setPosition(0,0,335,0)
        }
      }
      this.miniSpread = !this.miniSpread;
    },
    showListFn() {
      if (this.showList) {
        if (this.miniSpread) {
          remote.getCurrentWindow().setSize(335, 335);
        } else {
          remote.getCurrentWindow().setSize(335, 50);
        }
      } else {
        if (this.miniSpread) {
          remote.getCurrentWindow().setSize(335, 535);
        } else {
          remote.getCurrentWindow().setSize(335, 250);
        }
      }
      this.showList = !this.showList;
    },
    showLrcFn() {
      //开关歌词
      this.$refs.lyrics.lyricsChannel();
      if (this.showList) {
        remote.getCurrentWindow().setSize(335, 535);
      } else {
        remote.getCurrentWindow().setSize(335, 335);
      }
      this.miniSpread = true;
      this.showLrc = !this.showLrc;
    },
    onClick() {
      if (!this.hasMovedSinceMouseDown) {
        this.$electron.ipcRenderer.send("toggleplay");
      }
    },
    next() {
      //下一首
      if (this.repeatType === "repeat-random") {
        //随机播放
        const list = this.playOrder;
        const index = list.indexOf(this.currentIndex);
        let num = 0;
        if (index !== list.length - 1) {
          num = index + 1;
        }
        const currentMusic = { ...this.musicList[list[num]] };
        this.setMusicList({ currentMusic });
      } else {
        let index = "";
        if (this.currentIndex === this.musicList.length - 1) {
          index = 0;
        } else {
          index = this.currentIndex + 1;
        }
        if (typeof index === "string") return;
        const currentMusic = { ...this.musicList[index] };
        this.setMusicList({ currentMusic });
        //todo 判断元素不在可视区域再滚动
        const dom = document.querySelector(`.music-list${index}`);
        if (dom) dom.scrollIntoView();
      }
    },
    prev() {
      //上一首
      console.log("this.repeatType", this.repeatType);
      if (this.repeatType === "repeat-random") {
        //随机播放
        const list = this.playOrder;
        const index = list.indexOf(this.currentIndex);
        let num = 0;
        if (index !== 0) {
          num = index - 1;
        } else {
          num = list.length - 1;
        }
        const currentMusic = { ...this.musicList[list[num]] };
        this.setMusicList({ currentMusic });
      } else {
        let index = "";
        if (this.currentIndex === 0) {
          index = this.musicList.length - 1;
        } else {
          index = this.currentIndex - 1;
        }
        if (typeof index === "string") return;
        const currentMusic = { ...this.musicList[index] };
        this.setMusicList({ currentMusic });
        //todo 判断元素不在可视区域再滚动
        const dom = document.querySelector(`.music-list${index}`);
        if (dom) dom.scrollIntoView();
      }
    },
    getElementViewLeft(element) {
      let actualLeft = element.offsetLeft;
      let current = element.offsetParent;
      let elementScrollLeft;
      while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
      }
      elementScrollLeft =
        document.body.scrollLeft + document.documentElement.scrollLeft;
      return actualLeft - elementScrollLeft;
    },
    onThumbMouseDown(e) {
      const barWidth = this.$refs.barWrap.clientWidth;
      let percentage =
        (e.clientX - this.getElementViewLeft(this.$refs.barWrap)) / barWidth;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;

      this.$electron.ipcRenderer.send("onProgressDragBegin", percentage);
      document.addEventListener("mousemove", this.onDocumentMouseMove);
      document.addEventListener("mouseup", this.onDocumentMouseUp);
    },
    onDocumentMouseMove(e) {
      const barWidth = this.$refs.barWrap.clientWidth;
      let percentage =
        (e.clientX - this.getElementViewLeft(this.$refs.barWrap)) / barWidth;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;

      this.$electron.ipcRenderer.send("onProgressDragging", percentage);
    },
    onDocumentMouseUp(e) {
      document.removeEventListener("mouseup", this.onDocumentMouseUp);
      document.removeEventListener("mousemove", this.onDocumentMouseMove);

      const barWidth = this.$refs.barWrap.clientWidth;
      let percentage =
        (e.clientX - this.getElementViewLeft(this.$refs.barWrap)) / barWidth;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;
      this.$electron.ipcRenderer.send("onProgressDragEnd", percentage);
    },
    onThumbTouchStart(e) {
      const barWidth = this.$refs.barWrap.clientWidth;
      let percentage =
        (e.clientX - this.getElementViewLeft(this.$refs.barWrap)) / barWidth;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;

      this.$electron.ipcRenderer.send("onProgressDragBegin", percentage);
      document.addEventListener("touchmove", this.onDocumentTouchMove);
      document.addEventListener("touchend", this.onDocumentTouchEnd);
    },
    onDocumentTouchMove(e) {
      const touch = e.changedTouches[0];
      const barWidth = this.$refs.barWrap.clientWidth;
      let percentage =
        (touch.clientX - this.getElementViewLeft(this.$refs.barWrap)) /
        barWidth;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;

      this.$electron.ipcRenderer.send("onProgressDragging", percentage);
    },
    onDocumentTouchEnd(e) {
      document.removeEventListener("touchend", this.onDocumentTouchEnd);
      document.removeEventListener("touchmove", this.onDocumentTouchMove);

      const touch = e.changedTouches[0];
      const barWidth = this.$refs.barWrap.clientWidth;
      let percentage =
        (touch.clientX - this.getElementViewLeft(this.$refs.barWrap)) /
        barWidth;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;
      this.$electron.ipcRenderer.send("onProgressDragEnd", percentage);
    },
    rightClick() {
      const arr = [
        {
          label: "播放",
          click: function () {
            console.log("播放");
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
      // // 右键菜单
      // const list = this.$store.state.page.playlist;
      // const mm = list.map((el) => ({
      //   el,
      //   label: el.name,
      //   click: function () {
      //     console.log(el.name);
      //   },
      // }));
      // arr[4].submenu = [...arr[4].submenu, ...mm];
      const menu = new Menu();
      arr.forEach((el) => {
        menu.append(new MenuItem(el));
      });
      // 展示出来
      menu.popup(remote.getCurrentWindow());
    },
    adjustVolume() {
      
    },
    async selectsong(item, index) {
      this.setMusicList({
        currentMusic: { ...item },
      });
    },
    selectItem(index) {
      this.activeItem = index;
    },
  },
  created() {
    const [w, h] = remote.getCurrentWindow().getSize();
    if (w === 335 && h === 50) {
      //原窗口
      this.miniSpread = false;
      this.showList = false;
    } else if (h === 250) {
      //仅显示列表
      this.miniSpread = false;
      this.showList = true;
    } else if (h === 335) {
      //仅显示歌词
      this.miniSpread = true;
      this.showList = false;
    } else if (h === 535) {
      //开启歌词和列表
      this.miniSpread = true;
      this.showList = true;
    }
  },
};
</script>

<style lang="scss">
.mini-body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .music-box {
    position: relative;
    -webkit-app-region: drag;
    background: rgb(47, 47, 47);
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
      .aplayer-control-box {
        .music-info {
          display: none;
        }
        .play-box {
          display: block !important;
        }
      }
    }
    .aplayer-big-box {
      .bg-img-box {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        overflow: hidden;
        img {
          display: block;
          width: 335px;
          height: 335px;
        }
      }
      .show-lrc-img {
        filter: blur(20px);
      }
      .music-lrc {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        display: block;
        width: 335px;
        height: 335px;
        background: rgba(44, 44, 44, 0.6);
        .aplayer-lrc {
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 13.5px;
          line-height: 30px;
          .aplayer-lrc-contents {
            margin-top: 110px;
          }
        }
        .no-lrc {
          font-size: 16px;
          text-align: center;
          line-height: 335px;
          color: rgb(128, 128, 128);
        }
      }
    }
    .mini-set-box {
      text-align: center;
      .set-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 5px 5px 0 5px;
        height: 50px;
        width: 12px;
      }
      .title-body {
        display: none;
      }
      .set-more {
        display: none;
      }
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
    .mini-aplayer {
      display: flex;
      flex-direction: column;
      padding-bottom: 5px;
      flex: 1;
      .flex-box {
        display: flex;
      }
      .aplayer-img-box {
        position: relative;
        z-index: 101;
        padding: 8px 4px 0 4px;
        .blur-box {
          overflow: hidden;
          -webkit-app-region: no-drag;
          img {
            display: block;
            width: 33px;
            height: 33px;
            border-radius: 4px;
          }
        }
        &:hover {
          .open-pop {
            position: absolute;
            top: 8px;
            left: 4px;
            background: url(~@/assets/images/mini/mini-2.png) no-repeat;
            background-size: 100% 100%;
            width: 33px;
            height: 33px;
            z-index: 1;
          }
          .retract-pop {
            position: absolute;
            top: 8px;
            left: 4px;
            background: url(~@/assets/images/mini/mini-3.png) no-repeat;
            background-size: 100% 100%;
            width: 33px;
            height: 33px;
            z-index: 1;
          }
        }
      }
      .aplayer-control-box {
        min-width: 47%;
        .music-info {
          .aplayer-music {
            cursor: default;
            margin: 6px 0 0 0px;
            height: 32px;
            max-width: 44vw;
            .aplayer-title {
              display: block;
              color: rgb(190, 190, 190);
              font-size: 12px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              height: 18px;
            }

            .aplayer-author {
              display: block;
              font-size: 10px;
              color: rgb(146, 146, 146);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              i {
                display: inline-block;
                font-size: 8px;
                font-family: PingFangSC-Medium, PingFang SC;
                vertical-align: 1px;
              }
            }
          }

          .aplayer-lrc {
            z-index: 0;
          }
        }
        .play-box {
          display: none;
          & > div {
            flex-shrink: 0;
            height: 38px;
            background-size: cover;
            transition: all 0.3s ease;
            // max-width: 91px;
            width: 91px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: default;
            margin: 2px 0 0 30px;
            &:hover {
              .aplayer-button {
                opacity: 1;
              }
            }
            .aplayer-button {
              // position: absolute;
              border-radius: 50%;
              transition: all 0.1s ease;

              .aplayer-fill {
                fill: #fff;
              }
            }
            .next,
            .prev {
              -webkit-app-region: no-drag;
              background: url(~@/assets/images/change-red.png) no-repeat;
              background-size: 100% 100%;
              width: 10px;
              height: 10px;
              transform: rotate(-180deg);
            }
            .prev {
              transform: rotate(0deg);
            }
            .aplayer-play,
            .aplayer-pause {
              width: 28px;
              height: 28px;
              background-color: rgb(195, 70, 58);
              -webkit-app-region: no-drag;
              .aplayer-icon-play {
                width: 100%;
                height: 100%;
                background: url(~@/assets/images/play-btn.png) center center
                  no-repeat;
                background-size: 18px;
                margin-left: 1px;
              }
              .aplayer-icon-pause {
                width: 100%;
                height: 100%;
                background: url(~@/assets/images/end-btn.png) center center
                  no-repeat;
                background-size: 18px;
              }
            }
          }
        }
      }
      .aplayer-other-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        div {
          width: 20px;
          height: 20px;
          padding: 0 5px;
        }
        .sc {
          background: url(~@/assets/images/mini/mini-4.png) center/16px
            no-repeat;
        }
        .tj {
          background: url(~@/assets/images/mini/mini-5.png) center/14px
            no-repeat;
        }
        .xz {
          background: url(~@/assets/images/mini/mini-6.png) center/14px
            no-repeat;
        }
        .fx {
          background: url(~@/assets/images/mini/mini-7.png) center/10px
            no-repeat;
        }
        .red {
          background: url(~@/assets/images/mini/mini-9.png) center/14px
            no-repeat;
        }
      }
      .aplayer-progress-box {
        position: relative;
        cursor: default;
        left: 0;
        background: rgb(87, 85, 87);
        height: 2px;
        width: 77vw;
        margin-left: 42px;
        border-radius: 1px;
        -webkit-app-region: no-drag;
        &:hover {
          .aplayer-thumb {
            opacity: 1 !important;
          }
        }
        .aplayer-bar {
          position: relative;
          height: 3px;
          width: 100%;
          .aplayer-loaded {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            height: 3px;
            transition: all 0.5s ease;

            will-change: width;
          }
        }
        .aplayer-played {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          height: 2px;
          transition: background-color 0.3s;
          will-change: width;
          background: rgb(134, 131, 134);

          .aplayer-thumb {
            position: absolute;
            top: 1px;
            right: 5px;
            margin-top: -5px;
            margin-right: -10px;
            width: 10px;
            height: 10px;
            transform: scale(0.8);
            will-change: transform;
            transition: transform 300ms, background-color 0.3s,
              border-color 0.3s;
            border-radius: 50%;
            background: #fff;
            z-index: 200;
            cursor: pointer;
            opacity: 0;
            &:hover {
              transform: scale(1);
            }

            overflow: hidden;
            .aplayer-loading-icon {
              display: none;
              width: 100%;
              height: 100%;

              svg {
                position: absolute;
                animation: spin 1s linear infinite;
                fill: #ffffff;
              }
            }
          }
        }
      }
    }
    .mini-main-body {
      display: flex;
      width: 100%;
      z-index: 1001;
      max-height: 335px;
      .main-part {
        flex: 1;
        display: none;
      }
    }
  }
  .play-list-box {
    height: 200px;
    max-height: 200px;
    overflow-y: auto;
    -webkit-app-region: no-drag;
    .scroll-box {
      padding: 10px 15px;
    }
    .play-item {
      font-size: 12px;
      padding: 0 22px;
      height: 34px;
      &:nth-child(2n + 1) {
        background: rgb(51, 51, 51);
      }
      .word-box {
        display: inline-block;
        max-width: calc(100% - 20px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        line-height: 34px;
        span {
          display: inline-block;
        }
      }
      .more {
        display: none;
        width: 22px;
        height: 34px;
        background: url(~@/assets/images/more.png) center/16px 4px no-repeat;
      }
      &:hover {
        .more {
          display: inline-block;
        }
      }
    }
    .active-item {
      background: rgb(55, 55, 55);
    }
    .active-music {
      color: rgb(187, 69, 57);
    }
  }
  .spread-mini {
    &:hover {
      .mini-pic-body {
        display: block;
      }
      .aplayer-info {
        .aplayer-music {
          display: none !important;
        }
      }
      .aplayer-control-box {
        .music-info {
          display: none;
        }
        .play-box {
          display: block;
        }
      }
      .mini-main-body {
        opacity: 1;
        height: 335px;
      }
    }
    .mini-main-body {
      flex-direction: column;
      align-items: flex-start;
      opacity: 0;
      height: 335px;
    }
    .mini-aplayer {
      max-height: 50px;
      padding: 0 13px 0 22px;
      background: rgba(44, 44, 44, 0.9);
    }
    .main-part {
      display: block !important;
    }
    .mini-set-box {
      display: flex;
      width: 100%;
      height: 50px;
      background: rgb(44, 44, 44);
      opacity: 0.8;
    }
    .title-body {
      display: block !important;
      font-size: 12px;
      flex: 1;
      margin-top: 8px;
      i {
        display: inline-block;
        font-size: 8px;
        font-family: PingFangSC-Medium, PingFang SC;
        vertical-align: 1px;
      }
    }
    .set-more {
      display: block !important;
      margin: 25px 15px 0 0;
      -webkit-app-region: no-drag;
      img {
        display: block;
        width: 15px;
        height: 4px;
      }
    }
  }
}
</style>