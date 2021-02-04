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
          @click="SET_SHOWLRCPOP(false)"
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
          <router-view :ref="$route.name" @vipPopShowFn="vipPopShowFn"></router-view>
        </keep-alive>
        <musicList v-show="showMusicList" @selectsong="selectsong" />
      </div>
      <div class="player-box">
        <!-- :list="videoUpload.list" -->
        <!-- :shuffle="typeData == 2" -->
        <aplayer
          :music="videoUpload.music"
          :repeat="playRepeat"
          ref="player"
        ></aplayer>
      </div>
    </div>
    <div class="vip-pop" v-show="vipPopShow" >
      <img src="@/assets/images/vip-pop.png" @click="vipPopShow=false" alt="">
    </div>
  </div>
</template>

<script>
import leftNav from "@/components/leftNav";
import musicList from "@/components/musicList";
import mainPageTop from "@/components/mainPageTop";
import aplayer from "@/components/vuePlayer/vue-aplayer";

import { mapActions, mapMutations } from "vuex";
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
      vipPopShow:false,
    };
  },
  computed: {
    showLrcPop() {
      return this.$store.state.music.videoUpload.showLrcPop;
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
      return this.$store.state.page.ownRoutes;
    },
    // playRepeat() {
    //   if (this.typeData == 0) return "repeat-all";
    //   if (this.typeData == 1) return "repeat-one";
    //   return "no-repeat";
    // },
    videoUpload() {
      return this.$store.state.music.videoUpload;
    },
  },
  methods: {
    ...mapActions(["clearData", "logout", "loginStatus", "getUserPlaylist"]),
    ...mapMutations([
      "SET_SHOWMUSICLIST",
      "SET_USERINFO",
      "SET_PLAYLIST",
      "SET_OWNROUTES",
      "SET_SHOWLRCPOP",
      "SET_videoUpload",
    ]),
    channel(val) {
      this.$electron.ipcRenderer.send(val);
    },
    logoutFn() {
      this.logout()
        .then((res) => {
          if (res.code == 200) {
            this.SET_OWNROUTES([]);
            this.removeOwnRoute();
            console.log(
              "this.$router.historyRecord",
              this.$router.historyRecord
            );
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async toLogin() {
      try {
        await this.loginStatus();
        const playlist = await this.getUserPlaylist(this.userInfo.account.id);
        this.$refs.leftNav.showLogin = false;
        const navList = this.creatData.navList;
        this.creatData.navList = [...navList, ...playlist];
        if (!this.ownRoutes.length) this.addOwnRoute();
      } catch (error) {
        console.log("error", error);
      }
    },
    addOwnRoute() {
      const routes = this.$router.options.routes.map((el) => ({ ...el }));
      const newList = this.playlist.filter((el) =>
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
      this.SET_OWNROUTES(arr);
      routes[0].children = [...this.ownRoutes];
      this.$router.addRoutes([routes[0]]);
      this.$router.push("mainPage");
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
        this.SET_SHOWMUSICLIST(false);
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
    vipPopShowFn(){
      this.vipPopShow = !this.vipPopShow
    }
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
      this.SET_USERINFO("");
      this.SET_PLAYLIST([]);
      // this.SET_videoUpload()
    }
    const { active, musicList, music } = this.videoUpload;
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
  font-family: PingFangSC-Semibold, sans-serif;
  cursor: pointer;
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
  img{
    display: block;
    width:280px;
    height: 332px;
  }
}
</style>