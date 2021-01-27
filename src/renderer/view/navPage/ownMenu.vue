<template>
  <div class="own-menu">
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
        <input
          v-model="searchData"
          @input="searchFn"
          type="text"
          placeholder="搜索歌单音乐"
        />
      </div>
    </div>
    <div class="music-body" v-show="pageActive === 0">
      <div
        v-for="(item, index) in menuItem.tracks"
        :class="['item-box', { 'bg-white': active === index }]"
        :key="item.id"
        v-show="item.check"
        @click="checkMusic(index)"
      >
        <div class="item-index">{{ index | indexFilter }}</div>
        <div class="item-sc"></div>
        <div class="item-download"></div>
        <div class="item-name" v-html="item.name"></div>
        <div class="singer-name" v-html="item.ar[0].name"></div>
        <div class="item-zj" v-html="item.al.name"></div>
        <div class="item-time">{{ setTime(item.publishTime) }}</div>
      </div>
    </div>
    <div v-show="pageActive === 1">评论</div>
    <div v-show="pageActive === 2">收藏</div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
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
      menuItem: "",
      active: "",
      pageActive: 0,
      titleShow: false,
      searchData: "",
      imgError: require("@/assets/images/err-img3.png"),
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.page.userInfo;
    },
  },
  methods: {
    ...mapMutations(["SET_PLAYLIST"]),
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
    checkMusic(index) {
      this.active = index;
    },
    getMenuDetail() {
      this.$axios({
        type: "get",
        url: `/playlist/detail?id=${this.id}`,
      })
        .then(async (res) => {
          if (res.code === 200) {
            const playlist = res.playlist;
            console.log("获取歌单详情", playlist);
            playlist.tracks.forEach((el) => {
              el.check = true;
            });
            console.log("playlist", playlist);
            this.SET_PLAYLIST({ ...playlist });
            this.menuItem = playlist;
            console.log("this.menuItem", this.menuItem);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
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
      const tracks = this.menuItem.tracks;
      tracks.forEach((el) => {
        if (
          el.name.indexOf(this.searchData) > -1 ||
          el.ar[0].name.indexOf(this.searchData) > -1 ||
          el.al.name.indexOf(this.searchData) > -1
        ) {
          el.check = true;
        } else {
          el.check = false;
        }
        if (el.name.indexOf(this.searchData) > -1) {
          el.name = el.name.replace(
            `/${this.searchData}/g`,
            `<span class="blue">${this.searchData}</span>`
          );
        }
        if(el.ar[0].name.indexOf(this.searchData) > -1){
          el.ar[0].name = el.ar[0].name.replace(
            `/${this.searchData}/g`,
            `<span class="blue">${this.searchData}</span>`
          );
        }
        if(el.al.name.indexOf(this.searchData) > -1){
          el.al.name = el.al.name.replace(
            `/${this.searchData}/g`,
            `<span class="blue">${this.searchData}</span>`
          );
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
    next((_this) => {
      const mainBody = document.querySelector(".main-body");
      mainBody.scrollTop = 0;
      _this.pageActive = 0;
      _this.id = _this.$route.name.replace("ownMenu", "");
      _this.getMenuDetail();
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

<style lang="scss" scoped>
.own-menu {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 2s;
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
        height: 13px;
        margin: 0 8px;
      }
      .item-download {
        background: url(~@/assets/images/xz.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 13px;
        margin: 0 6px;
      }
      .item-name {
        color: rgb(179, 179, 179);
        flex: 1;
      }
      .singer-name {
        color: rgb(131, 131, 131);
        flex: 1;
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
    .bg-white {
      background: rgb(50, 50, 50) !important;
    }
  }
}
</style>