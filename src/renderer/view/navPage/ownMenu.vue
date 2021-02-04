<template>
  <div class="own-menu" v-if="menuItem">
    <transition name="fade">
      <div class="own-title" v-show="titleShow">
        <div class="title-name">{{ menuItem.name }}</div>
        <div class="title-btn">
          <div class="play-all"></div>
          <div class="title-sc"></div>
          <div class="share"></div>
          <div class="download"></div>
        </div>
      </div>
    </transition>
    <div class="own-top">
      <img
        class="own-pic"
        v-lazy="{ src: menuItem.coverImgUrl, error: imgError }"
        alt=""
      />
      <div class="info-box">
        <div class="own-name"><span>歌单</span>{{ menuItem.name }}<i></i></div>
        <div class="user-name">
          <img :src="userInfo.profile.avatarUrl" alt="" />
          <div class="name">{{ userInfo.profile.nickname }}</div>
          <div class="time">{{ menuItem.createTime | timeFilter }}创建</div>
        </div>
        <div class="btn-box">
          <div class="btn-play">
            <div class="btn-left"><i></i>播放全部</div>
            <div class="btn-right"></div>
          </div>
          <div class="btn-sc hover-btn"><i></i>收藏(0)</div>
          <div class="btn-share hover-btn"><i></i>分享(0)</div>
          <div class="btn-down hover-btn"><i></i>下载全部</div>
        </div>
        <div class="tag">
          标&nbsp;&nbsp;签：
          <span>添加标签</span>
        </div>
        <div class="info-content">
          <div>
            歌曲数：<span>{{ menuItem.trackCount }}</span>
          </div>
          <div>播放数：<span>0</span></div>
        </div>
        <div class="tag">
          简&nbsp;&nbsp;介：
          <span>添加简介</span>
        </div>
      </div>
    </div>
    <div class="tab-body">
      <div class="tab-box">
        <div :class="pageActive === 0 ? 'active' : ''" @click="checkPage(0)">
          歌曲列表
        </div>
        <div :class="pageActive === 1 ? 'active' : ''" @click="checkPage(1)">
          评论<span>（0）</span>
        </div>
        <div :class="pageActive === 2 ? 'active' : ''" @click="checkPage(2)">
          收藏者
        </div>
      </div>
      <div class="search-box">
        <div
          :class="searchData.length > 0 ? 'clear' : ''"
          @click="clearInput"
        ></div>
        <!-- @input="searchFn" -->
        <!-- 暂时使用失焦搜索 -->
        <input
          v-model="searchData"
          @blur="searchFn"
          type="text"
          placeholder="搜索歌单音乐"
        />
      </div>
    </div>
    <div class="music-body" v-show="pageActive === 0">
      <div
        v-for="(item, index) in menuItem.tracks"
        :class="[
          'item-box',
          { playing: active === index && activeMenu === pageIndex },
          { 'bg-white': activeItem === index },
        ]"
        :key="item.id"
        v-show="item.check"
        @dblclick="checkMusic(index, item.fee)"
        @click="checkItem(index)"
      >
        <div
          class="item-index"
          v-if="active === index && activeMenu === pageIndex"
        ></div>
        <div class="item-index" v-else>{{ index | indexFilter }}</div>
        <div class="item-sc"></div>
        <div class="item-download"></div>
        <!-- <div :class="['item-name', item.fee === 0 ? 'gray-word' : '']"> -->

        <div class="item-name">
          <div class="name-box">
            <span class="name" v-html="item.name"></span>
            <span class="name-tip" v-if="item.alia.length > 0"
              ><em>({{ item.alia.join("/") }})</em></span
            >
          </div>
          <span class="sq"></span>
          <!-- v-if="item.h.vd <= 0 || item.l.vd <= 0 || item.m.vd <= 0" -->
          <span class="mv" v-if="item.mv"></span>
          <span class="more"></span>
        </div>
        <div
          class="singer-name"
          v-html="item.ar.map((el) => el.name).join('/')"
        ></div>
        <div class="item-zj" v-html="item.al.name"></div>
        <div class="item-time">04:30</div>
        <!-- <div class="item-time">{{ setTime(item.publishTime) }}</div> -->
      </div>
    </div>
    <div v-show="pageActive === 1">评论</div>
    <div v-show="pageActive === 2">收藏</div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
const debounce = (() => {
  let timer = 0;
  return (callback, ms = 500) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  name: "ownMenu",
  data() {
    return {
      id: "",
      pageIndex: 0, //页面index
      pageActive: 0, //tab切换
      activeItem: "", //当前活动（未播放）歌曲
      titleShow: false,
      searchData: "",
      imgError: require("@/assets/images/err-img3.png"),
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.page.userInfo;
    },
    active() {
      return this.$store.state.music.videoUpload.active;
    },
    activeMenu() {
      return this.$store.state.music.videoUpload.activeMenu;
    },
    menuItem() {
      return this.$store.state.page.playlist[this.pageIndex];
    },
  },
  methods: {
    ...mapMutations(["SET_PLAYLIST", "SET_MUSICLIST"]),
    ...mapActions(["musicDetail", "getMenuDetail"]),
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    setTime(time) {
      time = new Date(time);
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      let hs = h ? `${this.add0(h)}:` : "";
      let mms = mm ? `${this.add0(mm)}:` : "";
      return hs + mms + this.add0(s);
    },
    async checkMusic(index, fee) {
      if (this.activeMenu === this.pageIndex && this.active === index) return;
      // if (fee === 0) return this.$toast("因合作方要求，该资源暂时下架>_<");
      else if (fee === 1) return this.$emit("vipPopShowFn");
      const musicList = await this.musicDetail(
        this.menuItem.tracks.map((el) => el.id)
      );
      this.activeItem = "";
      this.SET_MUSICLIST({ musicList, index, activeMenu: this.pageIndex });
    },
    checkItem(index) {
      if (this.activeMenu === this.pageIndex) {
        this.activeItem = "";
      } else {
        this.activeItem = index;
      }
    },
    listScroll() {
      const scrollTop = document.querySelector(".main-body").scrollTop;
      if (scrollTop > 300) {
        this.titleShow = true;
      } else {
        this.titleShow = false;
      }
    },
    checkPage(index) {
      this.pageActive = index;
    },
    clearInput() {
      this.searchData = "";
    },
    searchFn() {
      const replaceReg = new RegExp(this.searchData, "g");
      const tracks = this.menuItem.tracks;
      tracks.forEach((el) => {
        if (
          el.name.includes(this.searchData) &&
          !el.name.includes('<span class="blue-word">')
        ) {
          el.name = el.name.replace(
            replaceReg,
            `<span class="blue-word">${this.searchData}</span>`
          );
        } else {
          el.name = el.name
            .replace(/<span class="blue-word">/g, ``)
            .replace(/<\/span>/g, "");
        }
        if (
          el.ar[0].name.includes(this.searchData) &&
          !el.ar[0].name.includes('<span class="blue-word">')
        ) {
          el.ar[0].name = el.ar[0].name.replace(
            replaceReg,
            `<span class="blue-word">${this.searchData}</span>`
          );
        } else {
          el.ar[0].name = el.ar[0].name
            .replace(/<span class="blue-word">/g, ``)
            .replace(/<\/span>/g, "");
        }
        if (
          el.al.name.includes(this.searchData) &&
          !el.al.name.includes('<span class="blue-word">')
        ) {
          el.al.name = el.al.name.replace(
            replaceReg,
            `<span class="blue-word">${this.searchData}</span>`
          );
        } else {
          el.al.name = el.al.name
            .replace(/<span class="blue-word">/g, ``)
            .replace(/<\/span>/g, "");
        }
        if (
          el.name.includes(this.searchData) ||
          el.ar[0].name.includes(this.searchData) ||
          el.al.name.includes(this.searchData)
        ) {
          el.check = true;
        } else {
          el.check = false;
        }
      });
    },
  },
  filters: {
    indexFilter: (val) => {
      val = val + 1;
      if (val < 10) return "0" + val;
      else return val;
    },
    timeFilter(timestamp) {
      function addZero(num) {
        return num < 10 ? "0" + num : num;
      }
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = addZero(date.getMonth() + 1);
      let day = addZero(date.getDate());
      return year + "-" + month + "-" + day;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async (_this) => {
      const mainBody = document.querySelector(".main-body");
      mainBody.scrollTop = 0;
      _this.pageActive = 0;
      _this.pageIndex = _this.$route.meta.pageNav - 11;
      _this.id = _this.$route.name.replace("ownMenu", "");
      _this.getMenuDetail(_this.id);
      mainBody.addEventListener("scroll", () => debounce(_this.listScroll()));
    });
  },
  beforeRouteLeave(to, from, next) {
    const mainBody = document.querySelector(".main-body");
    mainBody.removeEventListener("scroll", () => this.listScroll());
    next();
  },
};
</script>
<style lang="scss">
.blue-word {
  color: rgb(142, 181, 222);
}
</style>
<style lang="scss" scoped>
.own-menu {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
    opacity: 0;
  }
  .hover-btn:hover {
    filter: brightness(1.2);
    background: rgb(48, 48, 48);
  }
  .own-title {
    background: rgb(37, 37, 37);
    position: fixed;
    top: 51px;
    height: 80px;
    width: calc(100% - 196px);
    color: #b3b3b3;
    font-size: 22px;
    .title-name {
      margin: 10px 30px;
    }
    .title-btn {
      margin: 0px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 170px;
      .play-all {
        background: url(~@/assets/images/play-all.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 20px;
      }
      .share {
        background: url(~@/assets/images/share-title.png) no-repeat;
        background-size: 100% 100%;
        width: 17px;
        height: 17px;
      }
      .download {
        background: url(~@/assets/images/xz.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 16px;
      }
      .title-sc {
        background: url(~@/assets/images/sc-title.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 20px;
      }
    }
  }
  .own-top {
    display: flex;
    padding: 15px 37px 25px 25px;
    .own-pic {
      display: block;
      width: 200px;
      height: 200px;
      border-radius: 6px;
    }
    .info-box {
      padding-left: 30px;
      .own-name {
        color: rgb(179, 179, 179);
        font-size: 22px;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        span {
          display: block;
          border: 1px solid rgb(176, 66, 55);
          font-size: 12px;
          line-height: 18px;
          color: rgb(176, 66, 55);
          padding: 0px 5.5px;
          border-radius: 3px;
          margin-right: 8px;
        }
      }
      .user-name {
        display: flex;
        align-items: center;
        font-size: 12px;
        img {
          width: 23px;
          height: 23px;
          border-radius: 50%;
        }
        .name {
          color: rgb(130, 165, 202);
          margin-left: 7px;
        }
        .time {
          color: rgb(129, 129, 129);
          margin-left: 11px;
        }
      }
      .tag {
        display: flex;
        font-size: 12px;
        color: rgb(175, 175, 175);
        margin-bottom: 5px;
        span {
          color: rgb(140, 179, 219);
          &:hover {
            color: rgb(179, 199, 220);
          }
        }
      }
      .btn-box {
        display: flex;
        font-size: 12px;
        color: rgb(175, 175, 175);
        margin: 22px 0 17px 0;
        .btn-play {
          width: 140px;
          height: 30px;
          border-radius: 15px;
          background: rgb(205, 77, 64);
          display: flex;
          align-items: center;
        }
        .btn-left {
          color: #fff;
          font-size: 14px;
          padding-right: 12px;
          height: 30px;
          border-right: 1px solid rgb(209, 93, 81);
          display: flex;
          align-items: center;
          i {
            display: inline-block;
            background: url(~@/assets/images/play-white.png) no-repeat;
            background-size: 100% 100%;
            width: 18px;
            height: 18px;
            vertical-align: -4px;
            margin: 0 4px 0 16px;
          }
        }
        .btn-right {
          flex: 1;
          background: url(~@/assets/images/add-title.png) no-repeat 8px center;
          background-size: 13px 13px;
          height: 30px;
        }
        .btn-sc {
          height: 30px;
          box-sizing: border-box;
          width: 90px;
          display: flex;
          align-items: center;
          border: 1px solid rgb(69, 69, 69);
          border-radius: 15px;
          justify-content: center;
          margin-left: 8px;
          font-size: 13px;
          i {
            display: block;
            background: url(~@/assets/images/sc-title.png) no-repeat;
            background-size: 100% 100%;
            width: 17px;
            height: 16px;
            margin-right: 4px;
          }
        }
        .btn-share {
          height: 30px;
          box-sizing: border-box;
          width: 90px;
          display: flex;
          align-items: center;
          border: 1px solid rgb(69, 69, 69);
          border-radius: 15px;
          justify-content: center;
          margin-left: 8px;
          font-size: 13px;
          i {
            display: block;
            background: url(~@/assets/images/share-title.png) no-repeat;
            background-size: 100% 100%;
            width: 16px;
            height: 14px;
            margin-right: 4px;
          }
        }
        .btn-down {
          height: 30px;
          box-sizing: border-box;
          width: 101px;
          display: flex;
          align-items: center;
          border: 1px solid rgb(69, 69, 69);
          border-radius: 15px;
          justify-content: center;
          margin-left: 8px;
          font-size: 13px;
          i {
            display: block;
            background: url(~@/assets/images/xz.png) no-repeat;
            background-size: 100% 100%;
            width: 18px;
            height: 15px;
            margin-right: 4px;
          }
        }
      }
      .info-content {
        display: flex;
        font-size: 12px;
        color: rgb(175, 175, 175);
        margin-bottom: 5px;
        span {
          color: rgb(135, 135, 135);
          margin-right: 13px;
        }
      }
    }
  }
  .tab-body {
    display: flex;
    margin: 0 50px 0 30px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(48, 48, 48);
    .tab-box {
      display: flex;
      font-size: 14px;
      color: rgb(179, 179, 179);
      line-height: 30px;
      width: 212px;
      height: 33px;
      justify-content: space-between;
      div {
        span {
          display: inline-block;
          font-size: 12px;
          color: rgb(120, 120, 120);
        }
      }
      div:not(.active):hover {
        color: #fff;
      }
      .active {
        color: rgb(169, 51, 45);
        border-bottom: 2px solid rgb(169, 51, 45);
        span {
          color: rgb(169, 51, 45);
        }
      }
    }
    .search-box {
      width: 120px;
      font-size: 12px;
      display: flex;
      align-items: center;
      height: 20px;
      input {
        display: block;
        outline: none;
        background: none;
        border: none;
        color: rgb(169, 169, 169);
        text-indent: 4px;
        width: 90px;
        &::-webkit-input-placeholder {
          color: rgb(73, 73, 73);
        }
      }
      div {
        display: block;
        background: url(~@/assets/images/search-icon.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 20px;
      }
      .clear {
        background: url(~@/assets/images/search-delete.png) center center
          no-repeat;
        background-size: 8px 8px;
      }
    }
  }
  .music-body {
    .item-box {
      display: flex;
      align-items: center;
      padding: 0 37px 0 25px;
      font-size: 12px;
      background: rgb(41, 41, 41);
      height: 34px;
      &:nth-child(2n) {
        background: rgb(37, 37, 37);
      }
      &:hover {
        background: rgb(50, 50, 50);
        .more {
          background: url(~@/assets/images/more.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .item-index {
        font-size: 12px;
        color: rgb(91, 91, 91);
        width: 30px;
      }
      .item-sc {
        background: url(~@/assets/images/sc-white.png) no-repeat;
        background-size: 100% 100%;
        width: 14px;
        height: 12px;
        margin: 0 8px;
      }
      .item-download {
        background: url(~@/assets/images/xz.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 13px;
        margin: 0 12px 0 0px;
      }
      .item-name {
        color: rgb(179, 179, 179);
        flex: 1;
        width: 28%;
        margin-left: 4px;
        display: flex;
        align-items: center;
        .name-box {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .name {
          display: inline-block;
        }
        .name-tip {
          display: inline-block;
          color: #b9b9b9;
          margin-left: 4px;
          em {
            color: rgb(90, 90, 90);
          }
        }
      }
      .sq {
        display: inline-block;
        background: url(~@/assets/images/sq-1.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 12px;
        min-width: 17px;
        margin: 0 2px;
      }
      .mv {
        display: inline-block;
        background: url(~@/assets/images/video-red.png) no-repeat;
        background-size: 100% 100%;
        width: 16px;
        height: 13px;
        min-width: 16px;
        margin: 0 2px;
      }
      .more {
        display: inline-block;
        width: 16px;
        height: 4px;
        min-width: 16px;
        margin: 0 4px 0 2px;
      }
      .gray-word {
        color: rgb(90, 90, 90);
      }
      .singer-name {
        color: rgb(131, 131, 131);
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .item-zj {
        color: rgb(131, 131, 131);
        flex: 1;
      }
      .item-time {
        color: rgb(89, 89, 89);
        width: 30px;
      }
    }
    .playing {
      background: rgb(50, 50, 50) !important;
      .item-name {
        color: rgb(187, 69, 57);
      }
      .item-index {
        display: inline-block;
        background: url(~@/assets/images/laba.png) left center no-repeat;
        background-size: 12px 12px;
        width: 30px;
        height: 34px;
      }
    }
    .bg-white {
      background: rgb(50, 50, 50) !important;
    }
  }
}
</style>