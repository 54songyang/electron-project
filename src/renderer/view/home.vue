<template>
  <div id="wrapper" v-if="creatData">
    <div class="top-nav">
      <div class="tool-box">
        <div class="close" @click="channel('close')"></div>
        <div class="min" @click="channel('min')"></div>
        <div class="max" @click="channel('max')"></div>
      </div>
      <div class="btn-box">
        <img class="next" src="@/assets/images/next1.png" alt />
        <img class="prev" src="@/assets/images/prev1.png" alt />
      </div>
      <div class="top-tool">
        <div
          v-for="(item,index) in creatData.topList"
          :key="index"
          @click="active=index"
          :class="{'active-nav':active===index}"
        >{{item}}</div>
      </div>
      <div class="search-box">
        <div class="input-box">
          <i class="search-icon"></i>
          <input placeholder="搜索" v-model="searchData" type="text" />
          <i class="search-clear" @click="searchData = ''"></i>
        </div>
        <div class="main-set">
          <img class="setting" src="@/assets/images/set.png" alt />
          <img class="email" src="@/assets/images/email.png" alt />
          <img class="skin" src="@/assets/images/skin.png" alt />
          <img class="small" src="@/assets/images/small.png" alt />
        </div>
      </div>
    </div>
    <div class="left-scroll">
      <leftNav class="left-nav" ref="leftNav" :navList="creatData.navList" :userInfo="userInfo"></leftNav>
    </div>
    <div class="main-body">
      <router-view></router-view>
    </div>
    <player />
  </div>
</template>

<script>
import leftNav from "@/components/leftNav";
import player from "@/components/player";
const { ipcRenderer: ipc } = require("electron");
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "home",
  components: { leftNav, player },
  data() {
    return {
      active: 0,
      searchData: "",
      creatData: null,
      userInfo: ""
    };
  },
  computed: {
    // ...mapState('.page',["userInfo"])
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    channel(val) {
      ipc.send(val);
    },
  },
  async beforeCreate() {
    this.creatData = await import("./js/main.json");
  },
  mounted() {
    this.getUserInfo();
    this.userInfo = this.$store.state.page.userInfo;
  }
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  cursor: pointer;
}
#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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
    line-height: 25px;
    font-size: 13px;
    input {
      display: block;
      flex: 1;
      background: none;
      outline: none;
      border: none;
      caret-color: rgb(165, 165, 165);
      color: rgb(182, 182, 182);
    }
    .search-icon {
      display: block;
      background: url(~@/assets/images/search.png) no-repeat;
      background-size: 100% 100%;
      width: 16px;
      height: 16px;
      margin: 0 5px;
    }
    .search-clear {
      display: block;
      background: url(~@/assets/images/clear.png) no-repeat;
      background-size: 100% 100%;
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
  }
  .main-set {
    display: flex;
    margin-left: 10px;
    img {
      display: block;
      width: 16px;
      height: 16px;
      margin: 0 12px;
    }
    .small {
      width: 18px;
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
  z-index: 99;
  background: rgb(45, 45, 45);
  height: 60px;
  -webkit-app-region: drag;
  .btn-box {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 196px;
    img {
      display: block;
      width: 15px;
      height: 15px;
    }
    .next {
      margin-left: 20px;
    }
  }
  .top-tool {
    display: flex;
    align-items: center;
    width: calc(100vw - 600px);
    margin: 0 40px 0 20px;
    div {
      flex: 1;
      text-align: center;
      color: rgb(134, 134, 134);
      &:hover {
        color: rgb(181, 181, 181);
      }
    }
    .active-nav {
      color: rgb(255, 255, 255);
      &:hover {
        color: rgb(255, 255, 255);
      }
    }
  }
  .tool-box {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    font-size: 20px;
    margin-top: 15px;
    div {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      // background: #dbdbdb;
      margin: 0 5px;
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
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 60px);
  width: 196px;
  .left-nav {
    margin-top: 60px;
  }
}
.main-body {
  position: absolute;
  left: 196px;
  top: 60px;
  width: calc(100vw - 196px);
  height: calc(100vh - 120px);
  background: rgb(37, 37, 37);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 0;
}
</style>