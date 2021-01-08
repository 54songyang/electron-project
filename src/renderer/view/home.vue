<template>
  <div>
    <div id="wrapper" v-if="creatData">
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
            :class="['next',{'canCli':$router.historyRecord.canNext()}]"
            src="@/assets/images/prev1.png"
            alt
          />
          <img @click="toPrev" :class="['prev',{'canCli':$router.historyRecord.canBack()}]" src="@/assets/images/next1.png" alt />
        </div>
        <div v-show="showLrcPop" class="close-lrc" @click="changeLrcPop(false)"></div>
        <div class="top-tool-box">
          <div class="top-tool" v-show="!showLrcPop">
            <div class="user-page-title" v-if="$route.meta.pageTitle">{{$route.meta.pageTitle}}</div>
            <component v-else-if="$route.meta.topName" :is="$route.meta.topName"></component>
            <div class="user-page-title" v-if="$route.path === '/userPage'">
              <p>{{userInfo.profile.nickname}}</p>
              的{{$route.query.name}}
            </div>
          </div>
        </div>

        <div class="search-box">
          <div class="input-box">
            <i class="search-icon"></i>
            <input placeholder="搜索" v-model="searchData" type="text" />
            <i v-show="searchData.length>0" class="search-clear" @click="searchData = ''"></i>
          </div>
          <div class="main-set">
            <img class="setting" src="@/assets/images/set.png" alt />
            <img class="email" src="@/assets/images/email.png" alt />
            <img class="skin" src="@/assets/images/skin.png" alt />
            <img @click="toMini" class="small" src="@/assets/images/small.png" alt />
          </div>
        </div>
      </div>
      <div class="left-scroll">
        <leftNav
          class="left-nav"
          ref="leftNav"
          @logout="logout"
          :navList="creatData.navList"
          :userInfo="userInfo"
        ></leftNav>
      </div>
      <div class="main-body">
        <router-view :ref="$route.name"></router-view>
      </div>
      <player />
    </div>
  </div>
</template>

<script>
import leftNav from "@/components/leftNav";
import player from "@/components/player";
import mainPageTop from "@/components/mainPageTop";
import { mapActions, mapState } from "vuex";
export default {
  name: "home",
  components: { leftNav, player, mainPageTop },
  data() {
    return {
      activeSize: [],
      active: 0,
      searchData: "",
      creatData: null,
      userInfo: {}
    };
  },
  computed: {
    showLrcPop() {
      return this.$store.state.page.showLrcPop;
    },
  },
  methods: {
    ...mapActions(["renderData", "clearData", "changeLrcPop"]),
    channel(val) {
      this.$electron.ipcRenderer.send(val);
    },
    // dayList() {
    //   //每日歌单推荐
    //   this.$axios({
    //     type: "get",
    //     url: "/recommend/songs"
    //   })
    //     .then(res => {
    //       console.log("ewe", res);
    //       if (res.status === 200) {
    //         console.log("res", res.data);
    //       }
    //     })
    //     .catch(err => {
    //       console.log("err", err);
    //     });
    // },
    logout() {
      this.$axios({
        type: "get",
        url: "/logout"
      })
        .then(res => {
          console.log("退出登录", res);
          if (res.status === 200) {
            localStorage.removeItem("userInfo");
            this.clearData();
            this.userInfo = this.$store.state.page.userInfo;
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    toMini() {
      this.$electron.ipcRenderer.send("mini");
    },
    toNext() {
      if(!this.$router.historyRecord.canNext()) return;
      this.$router.goNext();
    },
    toPrev() {
      this.$router.goBack();
    }
  },
  async beforeCreate() {
    this.creatData = await import("./js/main.json");
  },
  async mounted() {
    console.log('90',this.$router.historyRecord.canNext());
    await this.renderData();
    this.userInfo = this.$store.state.page.userInfo;
  }
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
  z-index: 99;
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
      padding:4.5px;
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
      background-size: 12px 12px;
      background-color: rgb(250, 100, 94);
    }
    .min {
      background: url(~@/assets/images/min.png) center center no-repeat;
      background-size: 12px 12px;
      background-color: rgb(232, 189, 90);
    }
    .max {
      background: url(~@/assets/images/max.png) center center no-repeat;
      background-size: 12px 12px;
      background-color: rgb(106, 187, 83);
    }
  }
}
.left-scroll {
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 60px);
  width: 196px;
  .left-nav {
    margin-top: 51px;
  }
}
.main-body {
  height: calc(100vh - 111px);
  background: #252525;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 0;
  margin-left: 196px;
  margin-top: 51px;
}
</style>