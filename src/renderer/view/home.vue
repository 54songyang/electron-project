<template>
  <div>
    <div
      id="wrapper"
      v-if="creatData"
      @mousewheel="wheelFn"
      @click="globalClick"
    >
      <div class="top-cli" @dblclick="channel('max')"></div>
      <div class="top-nav">
        <div class="tool-box">
          <div class="close" @click="channel('close')"></div>
          <div class="min" @click="channel('min')"></div>
          <div class="max" @click="channel('full')"></div>
        </div>
        <div class="btn-box" v-show="!showLrcPop">
          <img
            @click="toNext"
            :class="['next', { canCli: $router.historyRecord.canNext() }]"
            src="@/assets/images/prev1.png"
            alt
          />
          <img
            @click="toPrev"
            :class="['prev', { canCli: $router.historyRecord.canBack() }]"
            src="@/assets/images/next1.png"
            alt
          />
        </div>
        <div
          v-show="showLrcPop"
          class="close-lrc"
          @click="setShowLrcPop(false)"
        ></div>
        <div class="top-tool-box">
          <div class="top-tool" v-show="!showLrcPop">
            <div class="user-page-title" v-if="$route.meta.pageTitle">
              {{ $route.meta.pageTitle }}
            </div>
            <component
              v-else-if="$route.meta.topName"
              :is="$route.meta.topName"
            ></component>
            <div class="user-page-title" v-if="$route.path === '/userPage'">
              <p>{{ userInfo.profile.nickname }}</p>
              的{{ $route.query.name }}
            </div>
          </div>
        </div>

        <div class="search-box">
          <div class="input-box">
            <i class="search-icon"></i>
            <input placeholder="搜索" v-model="searchData" type="text" />
            <i
              v-show="searchData.length > 0"
              class="search-clear"
              @click="searchData = ''"
            ></i>
          </div>
          <div class="main-set">
            <img class="setting" src="@/assets/images/set.png" alt />
            <img class="email" src="@/assets/images/email.png" alt />
            <img class="skin" src="@/assets/images/skin.png" alt />
            <img
              @click="toMini"
              class="small"
              src="@/assets/images/small.png"
              alt
            />
          </div>
        </div>
      </div>
      <div class="left-scroll">
        <leftNav
          class="left-nav"
          ref="leftNav"
          @logoutFn="logoutFn"
          :navList="creatData.navList"
          :userInfo="userInfo"
        ></leftNav>
      </div>
      <div
        :class="[
          'main-body',
          { 'main-over': mainOver },
          { 'no-scroll-bar': showMusicList },
        ]"
      >
        <keep-alive>
          <router-view
            :ref="$route.name"
            @vipPopShowFn="vipPopShowFn"
          ></router-view>
        </keep-alive>
        <musicList v-show="showMusicList" @selectsong="selectsong" />
      </div>
      <div class="player-box">
        <aplayer :repeat="playRepeat" ref="player"></aplayer>
      </div>
    </div>
    <div class="vip-pop" v-show="vipPopShow">
      <img
        src="@/assets/images/vip-pop.png"
        @click="vipPopShow = false"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import leftNav from "@/components/leftNav";
import musicList from "@/components/musicList";
import mainPageTop from "@/components/mainPageTop";
import aplayer from "@/components/vuePlayer/vue-aplayer";

import { mapActions } from "vuex";
export default {
  name: "home",
  components: { leftNav, aplayer, mainPageTop, musicList },
  data() {
    return {
      player: null,
      typeData: 0,
      activeSize: [],
      active: 0,
      searchData: "",
      creatData: null,
      mainOver: false,
      playRepeat: "no-repeat",
      vipPopShow: false,
    };
  },
  computed: {
    showLrcPop() {
      return this.$store.state.music.showLrcPop;
    },
    showMusicList() {
      return this.$store.state.music.showMusicList;
    },
    playlist() {
      //歌单
      return this.$store.state.page.playlist;
    },
    userInfo() {
      return this.$store.state.page.userInfo;
    },
    ownRoutes() {
      const arr = localStorage.getItem("ownRoutes");
      if (arr.length)
        return JSON.parse(localStorage.getItem("ownRoutes"));
      else return [];
    },
  },
  methods: {
    ...mapActions([
      "setShowLrcPop",
      "setShowMusicList",
      "setPlayList",
      "setClearMusic",
      "setUserInfo",
      "setClearState",
    ]),
    channel(val) {
      this.$electron.ipcRenderer.send(val);
    },
    async logoutFn() {
      const { code } = await this.$utils.logout();
      if (code != 200) return;
      this.setClearState();
      this.setClearMusic();
      localStorage.setItem("ownRoutes", []);
      this.removeOwnRoute();
      delete this.$store.state.Counter;
      delete this.$store.state.test;
    },
    async toLogin() {
      try {
        const userRes = await this.$utils.loginStatus();
        await this.setUserInfo(userRes);
        const playlist = await this.$utils.getUserPlaylist(userRes.account.id);
        this.setPlayList(playlist);
        this.$refs.leftNav.showLogin = false;
        const navList = this.creatData.navList;
        this.creatData.navList = [...navList, ...playlist];
        if (!this.ownRoutes.length)
          this.addOwnRoute(playlist);
      } catch (error) {
        console.log("error", error);
      }
    },
    async addOwnRoute(playlist) {
        const routes = this.$router.options.routes.map((el) => ({ ...el }));
        const newList = playlist.filter((el) =>
          routes[0].children.every((el1) => el1.path !== el.path)
        );
        const arr = newList.map((el, index) => {
          return {
            path: `/ownMenu${el.id}`,
            name: `ownMenu${el.id}`,
            component: require("@/view/navPage/ownMenu").default,
            meta: {
              pageNav: index + 11,
            },
          };
        });
        window.localStorage.setItem("ownRoutes", JSON.stringify(arr));
        routes[0].children = [...arr];
        this.$router.addRoutes([routes[0]]);
        if (this.$route.name !== "mainPage") {
          this.$router.push("mainPage");
        }
        //!!!
        this.$router.backFlag = false;
        this.$router.historyRecord._history = [];
        this.$router.historyRecord._index = -1;
    },
    async removeOwnRoute() {
      //清除客户路由
      const res = this.creatData.navList.filter((el) => !el.id);
      this.creatData.navList = res;
      const routes = this.$router.options.routes;
      const arr = routes[0].children.filter(
        (el) => !el.path.includes("ownMenu")
      );
      routes[0].children = arr;
      this.$router.resetRouter();
      this.$router.push("mainPage");
      //!!!
      this.$router.backFlag = false;
      this.$router.historyRecord._history = [];
      this.$router.historyRecord._index = -1;
    },
    globalClick(e) {
      const listBody = document.querySelector(".list-body");
      const playerBox = document.querySelector(".player-box");
      if (!listBody.contains(e.target) && !playerBox.contains(e.target)) {
        this.setShowMusicList(false);
      }
    },
    toMini() {
      this.$electron.ipcRenderer.send("mini");
    },
    toNext() {
      if (!this.$router.historyRecord.canNext()) return;
      this.$router.goNext();
    },
    toPrev() {
      this.$router.goBack();
    },
    wheelFn(e) {
      const listBody = document.querySelector(".list-body");
      if (listBody.contains(e.target)) {
        this.mainOver = true;
      } else {
        this.mainOver = false;
      }
    },
    selectsong(song) {
      this.$refs.player.onSelectSong(song);
    },
    vipPopShowFn() {
      this.vipPopShow = !this.vipPopShow;
    },
  },
  updated() {
    this.player = this.$refs.player;
  },
  async beforeCreate() {
    const obj = await import("./js/main.json").then((res) => res.default);
    obj.navList = [...obj.navList, ...this.playlist];
    this.creatData = obj;
  },
  async mounted() {
    this.$electron.ipcRenderer.on("toLogin", (e, message) => this.toLogin());
    if (!this.userInfo.profile) {
      this.setUserInfo("");
      this.setPlayList([]);
    }
  },
};
</script>
<style lang="scss">
.hover-bright:hover {
  filter: brightness(2.3);
}
// .click-bright:hover{
//   background-color: rgb(56, 56, 56);
//   border-radius: 50%;
// }
body {
  font-family: PingFangSC-Regular, PingFang SC, sans-serif;
}
</style>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .top-cli {
    position: fixed;
    width: 100%;
    height: 15px;
    top: 0;
    right: 0;
    z-index: 100000;
    -webkit-app-region: drag;
  }
}
.search-box {
  display: flex;
  align-items: center;
  .input-box {
    display: flex;
    align-items: center;
    background: rgb(75, 75, 75);
    border-radius: 15px;
    height: 25px;
    width: 149px;
    line-height: 25px;
    font-size: 13px;
    input {
      display: block;
      width: 107px;
      background: none;
      outline: none;
      border: none;
      font-size: 12px;
      line-height: 15px;
      caret-color: rgb(165, 165, 165);
      color: rgb(182, 182, 182);
    }
    .search-icon {
      display: block;
      background: url(~@/assets/images/search.png) no-repeat;
      background-size: 100% 100%;
      width: 14px;
      height: 14px;
      margin: 0 5px;
    }
    .search-clear {
      display: block;
      background: url(~@/assets/images/clear.png) no-repeat;
      background-size: 100% 100%;
      width: 12px;
      height: 12px;
      margin-right: 6px;
    }
  }
  .main-set {
    display: flex;
    justify-content: space-between;
    width: 128px;
    margin: 0 12px 0 23px;
    img {
      display: block;
      width: 16.5px;
      height: 16.5px;
    }
    .email {
      width: 22px;
      height: 20px;
    }
    .skin {
      width: 18px;
      height: 20px;
    }
    .small {
      width: 20px;
      height: 18px;
    }
  }
}
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  z-index: 151;
  background: rgb(45, 45, 45);
  height: 51px;
  .btn-box {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 196px;
    img {
      display: block;
      width: 15px;
      height: 15px;
      padding: 4.5px;
      box-sizing: content-box;
      filter: brightness(0.5);
    }
    .next {
      margin-left: 20px;
    }
    .canCli {
      filter: brightness(2);
    }
  }
  .close-lrc {
    margin: 14px 0 0 80px;
    background: url(~@/assets/images/xl.png) no-repeat;
    background-size: 100% 100%;
    width: 16px;
    height: 16px;
  }
  .top-tool-box {
    margin-left: 27px;
    flex: 1;
    font-family: PingFangSC-Semibold, sans-serif;
    display: flex;
    align-items: center;
    font-size: 14px;
    .top-tool {
      display: flex;
      align-items: center;
      .user-page-title {
        font-size: 14.5px;
        color: #fff;
        font-weight: bold;
        p {
          display: inline-block;
          color: rgb(126, 126, 126);
        }
      }
    }
  }
  .tool-box {
    display: flex;
    position: fixed;
    top: 0;
    left: 4px;
    z-index: 999;
    font-size: 20px;
    margin-top: 15px;
    div {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin: 0 4px;
    }
    .close {
      background: rgb(250, 100, 94);
    }
    .min {
      background: rgb(232, 189, 90);
    }
    .max {
      background: rgb(106, 187, 83);
    }
  }
  .tool-box:hover {
    .close {
      background: url(~@/assets/images/close.png) center center no-repeat;
      background-size: 6px 6px;
      background-color: rgb(250, 100, 94);
    }
    .min {
      background: url(~@/assets/images/min.png) center center no-repeat;
      background-size: 6px 2px;
      background-color: rgb(232, 189, 90);
    }
    .max {
      background: url(~@/assets/images/max.png) center center no-repeat;
      background-size: 6px 6px;
      background-color: rgb(106, 187, 83);
    }
  }
}
.left-scroll {
  position: absolute;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  height: calc(100vh - 60px);
  min-height: calc(100vh - 60px);
  background: #202020;
  width: 196px;
  z-index: 150;
}
.main-body {
  position: relative;
  height: calc(100vh - 111px);
  background: #252525;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 0;
  margin: 51px 0 0 196px;
  &::-webkit-scrollbar{
    width:5px;
    height:16px;
    background-color:#202020;;
  }
  &::-webkit-scrollbar-track{
    background-color:#252525;
  }
  &::-webkit-scrollbar-thumb{
    border-radius:10px;
    box-shadow:inset 0 0 6px rgba(0,0,0,.3);
    background-color:#555;
  }
}
.main-over {
  overflow-y: hidden;
}
.no-scroll-bar::-webkit-scrollbar {
  display: none;
  width: 0;
  opacity: 0;
}
</style>
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
.vip-pop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  img {
    display: block;
    width: 280px;
    height: 332px;
  }
}
</style>