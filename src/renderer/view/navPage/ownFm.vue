<template>
  <div class="own-body" v-if="personalFm.length > 0">
    <div class="own-box">
      <div class="own-left">
        <div class="img-box">
          <div
            v-for="(item, index) in personalFm"
            :key="item.album.id"
            :class="['slider', setClass(index)]"
            @click="checkImg(index)"
          >
            <img
              :class="['own-img']"
              v-lazy="imgLazy(item.album.picUrl, '')"
              :src="item.album.picUrl"
            />
          </div>
          <i :class="{ 'play-i': isPlaying }" @click="ownPlay"></i>
        </div>
        <div class="btn-box">
          <div class="own-collection"></div>
          <div class="own-delete"></div>
          <div class="own-next" @click="ownNext"></div>
          <div class="own-more" @click="rightClick"></div>
        </div>
      </div>
      <div class="own-right" v-if="currentMusic">
        <div class="music-name">{{ currentMusic.name }}<em>标准音质</em></div>
        <div class="tip-box">
          <div>
            专辑：<span>{{ currentMusic.al ? currentMusic.al.name : "" }}</span>
          </div>
          <div>
            歌手：<span>{{
              currentMusic.ar
                ? currentMusic.ar.map((el) => el.name).join("/")
                : ""
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";
import { mapActions } from "vuex";
const { Menu, MenuItem } = remote;
export default {
  name: "ownFm",
  data() {
    return {
      personalFm: [], //私人FM
      activeIndex: 0,
    };
  },
  computed: {
    isPlaying() {
      return this.$store.state.music.isPlaying;
    },
    playType() {
      return this.$store.state.music.playType;
    },
    currentMusic() {
      return this.$store.state.music.currentMusic;
    },
  },
  methods: {
    ...mapActions(["setMusicList"]),
    imgLazy(src, error) {
      return {
        src,
        error,
      };
    },
    ownPlay() {
      if (!this.isPlaying) {
        const currentMusic = { ...this.personalFm[this.activeIndex] };
        currentMusic.al = currentMusic.album;
        currentMusic.ar = currentMusic.artists;
        currentMusic.dt = currentMusic.duration;
        currentMusic.url = `https://music.163.com/song/media/outer/url?id=${currentMusic.id}.mp3`;
        console.log("currentMusic", currentMusic);
        this.setMusicList({ currentMusic });
      }
    },
    //私人FM
    getPersonalFm() {
      return this.$axios({
        type: "get",
        url: `/personal_fm?timestamp=${new Date().valueOf()}`, //时间戳去除缓存
      })
        .then((res) => {
          console.log("获取私人FM", res);
          if (res.code === 200) {
            this.personalFm = [...this.personalFm, ...res.data];
            return true;
          } else {
            throw new Error("请求失败");
          }
        })
        .catch((err) => {
          console.log("err", err);
          throw err;
        });
    },
    setClass(index) {
      if (index === this.activeIndex - 1) {
        return "prev-slider";
      } else if (index === this.activeIndex) {
        return "active-slider";
      } else if (index === this.activeIndex + 1) {
        return "next-slider";
      } else if (index === this.activeIndex + 2) {
        return "after-slider";
      } else return "none-sider";
    },
    async ownNext() {
      try {
        if (this.personalFm.length === this.activeIndex + 2) {
          this.activeIndex++;
          await this.getPersonalFm();
        } else if (this.personalFm.length === this.activeIndex + 1) {
          const res = await this.getPersonalFm();
          if (!res) throw "";
          this.activeIndex++;
        } else {
          this.activeIndex++;
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    checkImg(index) {
      this.activeIndex = index;
    },
    rightClick() {
      const _this = this;
      const arr = [
        {
          label: "收藏",
          click: function () {
            console.log("收藏");
          },
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
          label: "跳转到垃圾桶列表",
          click: function () {
            console.log("跳转到垃圾桶列表");
          },
        },
      ];
      // 右键菜单
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
  mounted() {
    this.getPersonalFm();
  },
};
</script>

<style lang="scss" scoped>
.own-body {
  .own-box {
    display: flex;
    .own-left {
      flex: 1;
      .img-box {
        position: relative;
        width: 360px;
        height: 270px;
        overflow: hidden;
        margin: 90px 0 50px 35px;
        .own-img {
          display: block;
          width: 270px;
          height: 270px;
          border-radius: 5px;
        }
        .slider {
          position: absolute;
          top: 0;
          transition: all 0.5s ease;
        }
        .prev-slider {
          transform: translateX(-20px) scale(0.85);
        }
        .active-slider {
          opacity: 1;
          z-index: 99;
          transform: translateX(40px) scale(1);
        }
        .next-slider {
          transform: translateX(310px);
          opacity: 0;
          z-index: 100;
        }
        .after-slider {
          transform: translateX(580px);
          display: none;
        }
        .none-sider {
          display: none;
        }
        i {
          position: absolute;
          opacity: 0.9;
          border-radius: 50%;
          transition: all 0.3s linear;
          background-color: #f3eeee;
          height: 54px;
          width: 54px;
          right: 155px;
          bottom: 108px;
          background-image: url(~@/assets/images/play-red.png);
          background-repeat: no-repeat;
          background-position: 19px center;
          background-size: 20px;
          z-index: 101;
        }
        .play-i {
          bottom: 10px;
          right: 63px;
          width: 40px;
          height: 40px;
          background-image: url(~@/assets/images/stop-red.png);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 20px;
        }
      }
      .btn-box {
        display: flex;
        width: 310px;
        align-items: center;
        justify-content: space-around;
        margin-left: 35px;
        div {
          background-color: rgb(46, 46, 46);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-position: center center;
          &:hover {
            background-color: rgb(54, 54, 54);
          }
        }
        .own-collection {
          background-image: url(~@/assets/images/sc-white.png);
          background-size: 18px 15px;
        }
        .own-next {
          background-image: url(~@/assets/images/own-next.png);
          background-size: 20px 18px;
        }
        .own-more {
          background-image: url(~@/assets/images/own-more.png);
          background-size: 20px 15px;
        }
        .own-delete {
          background-image: url(~@/assets/images/own-delete.png);
          background-size: 20px 18px;
        }
      }
    }
    .own-right {
      flex: 1;
      margin-top: 46px;
      .music-name {
        font-size: 21px;
        em {
          display: inline-block;
          font-size: 13px;
          word-break: keep-all;
          border: 1px solid rgb(132, 57, 50);
          border-radius: 2px;
          color: rgb(132, 57, 50);
          line-height: 20px;
          width: 63px;
          height: 20px;
          text-align: center;
          vertical-align: 2px;
          margin-left: 6px;
        }
      }
      .tip-box {
        display: flex;
        font-size: 12px;
        margin-top: 13px;
        padding-right: 20px;
        justify-content: space-around;
        div {
          flex: 1;
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          span {
            color: rgb(144, 184, 266);
          }
        }
      }
    }
  }
}
</style>