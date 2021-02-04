<template>
  <div class="nav-body">
    <div class="user-box-top">
      <div class="user-box" @click.stop="popShow">
        <img
          v-if="Object.keys(userInfo).length > 0"
          :src="userInfo.profile.avatarUrl"
          alt
        />
        <img class="no-person" v-else src="@/assets/images/person.png" alt />
        <div class="user-name">
          {{
            Object.keys(userInfo).length > 0
              ? userInfo.profile.nickname
              : "未登录"
          }}
        </div>
        <i class="user-detail" @click="openDetail"></i>
      </div>
    </div>
    <div class="title-box">
      <div
        v-for="(item, index) in navList"
        :key="index"
        :class="[
          'item',
          { 'item-hover': item.name },
          { active: $route.meta.pageNav === index },
        ]"
        @click="selectPage(item, index, item.id)"
      >
        <template v-if="!item.id">
          <i :class="['item-icon', `icon-${item.name}`]" v-if="item.nav"></i>
          <div :class="[item.nav ? 'nav' : 'title']">
            {{ item.nav ? item.nav : item.title || item.name }}
          </div>
        </template>
        <template v-if="item.id">
          <i class="item-icon music-icon"></i>
          <div :class="['nav', { playing: activeMenu === index - 11 }]">
            {{ item.specialType ? "我喜欢的音乐" : item.name }}
          </div>
        </template>
      </div>
    </div>
    <div
      class="user-detail-box cloud-pop-box"
      v-if="Object.keys(userInfo).length > 0"
      v-ownShow="showUserDetail"
    >
      <div class="user-top">
        <div @click="toList('event', '动态')">
          <p>{{ userInfo.profile.eventCount }}</p>
          <span>动态</span>
        </div>
        <div @click="toList('follows', '关注')">
          <p>{{ userInfo.profile.follows }}</p>
          <span>关注</span>
        </div>
        <div @click="toList('followeds', '粉丝')">
          <p>{{ userInfo.profile.followeds }}</p>
          <span>粉丝</span>
        </div>
      </div>
      <div class="sign-box">
        <div class="user-sign" @click="signin">
          <i></i>
          <p>签到</p>
          <!-- <p>已签到</p> -->
        </div>
      </div>
      <div class="border"></div>
      <div class="btn-list">
        <div
          class="btn-item"
          @click="$electron.shell.openExternal('https://music.163.com/member')"
        >
          <div class="btn-title vip">会员中心</div>
          <div class="btn-right">
            {{
              userInfo.profile.vipType == 0
                ? "未订购"
                : userInfo.profile.vipType
            }}
          </div>
        </div>
        <div
          class="btn-item"
          @click="
            $electron.shell.openExternal('https://music.163.com/user/level')
          "
        >
          <div class="btn-title grade">等级</div>
          <div class="btn-right">Lv.{{ userInfo.level }}</div>
        </div>
        <div
          class="btn-item"
          @click="
            $electron.shell.openExternal('https://music.163.com/store/product')
          "
        >
          <div class="btn-title shopping">商城</div>
        </div>
        <div class="border"></div>
        <div class="btn-item" @click="$router.push('setInfo')">
          <div class="btn-title setting">个人信息设置</div>
          <div class="btn-right"></div>
        </div>
        <div class="btn-item">
          <div class="btn-title phone">绑定社交账号</div>
          <div class="btn-right"></div>
        </div>
        <div class="border"></div>
        <div class="btn-item" @click="$emit('logoutFn')">
          <div class="btn-title switch">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "leftNav",
  props: ["navList", "userInfo"],
  data() {
    return {
      showUserDetail: false,
      account: "",
      password: "",
    };
  },
  computed: {
    pageActive() {
      return this.$store.state.page.pageActive;
    },
    activeMenu() {
      return this.$store.state.music.videoUpload.activeMenu;
    },
  },
  methods: {
    ...mapMutations(["SET_PAGEACTIVE"]),
    ...mapActions(["getUserDetail"]),
    selectPage(item, index, id) {
      this.SET_PAGEACTIVE(index);
      if (id) {
        this.$router.push(`/ownMenu${item.id}?id=${item.id}`);
      } else {
        this.$router.push(item.name);
      }
    },
    async popShow() {
      if (!this.userInfo || JSON.stringify(this.userInfo) === "{}") {
        this.$electron.ipcRenderer.send("showLogin");
      } else {
        if (!this.userInfo) {
          await this.getUserDetail();
        }
        this.showUserDetail = !this.showUserDetail;
        this.getUserDetail();
      }
    },
    toList(from, name) {
      this.$router.push({
        name: "userPage",
        query: {
          from,
          name,
          userId: this.userInfo.profile.userId,
        },
      });
    },
    signin() {
      this.$axios({
        type: "get",
        url: "/daily_signin",
      })
        .then((res) => {
          if (res.code === 200) {
            console.log("userInfo", this.userInfo);
            console.log("签到res", res.data);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    openDetail() {},
    beforeunloadFn() {
      localStorage.setItem("active", this.pageActive);
    },
  },
  directives: {
    ownShow: {
      bind: function (el, binding, vnode) {
        el.style.display = binding.value ? "block" : "none";
      },
      update: function (el, binding, vnode) {
        let _this = vnode.context,
          value = binding.value,
          bindData = binding.expression;
        if (!value) {
          el.style.display = "none";
          _this[bindData] = false;
        } else {
          el.style.display = "block";
          _this[bindData] = true;
          let handFn = function (e) {
            el.style.display = "none";
            _this[bindData] = false;
            document.body.removeEventListener("click", handFn, false);
            // if (
            //   document.querySelector(".user-top").contains(e.target) ||
            //   !el.contains(e.target)
            // ) {
            //   el.style.display = "none";
            //   _this[bindData] = false;
            //   document.body.removeEventListener("click", handFn, false);
            // }
          };
          document.body.addEventListener("click", handFn);
        }
      },
    },
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
  },
  mounted() {
    const pageNav = this.$route.meta.pageNav;
    window.addEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    const oldActive = localStorage.getItem("active");
    this.SET_PAGEACTIVE(pageNav <= 11 ? pageNav : Number(oldActive) || 0);
  },
};
</script>

<style lang="scss" scoped>
.nav-body {
  display: flex;
  flex-direction: column;
  width: 196px;
  height: calc(100vh - 120px);
  color: rgb(177, 177, 177);
  margin-top: 60px;
  .user-box-top {
    position: relative;
    height: 50px;
    .user-box {
      position: fixed;
      top: 47px;
      display: flex;
      align-items: center;
      padding: 5px 15px 0 15px;
      background: rgb(32, 32, 32);
      z-index: 10;
      height: 60px;
      img {
        display: block;
        width: 29px;
        height: 25px;
        border-radius: 50%;
      }
      .no-person{
        border-radius: 0;
      }
      .user-name {
        font-size: 14px;
        line-height: 18px;
        margin-left: 10px;
        cursor: default;
      }
      .user-detail {
        display: block;
        background: url(~@/assets/images/user.png) no-repeat;
        background-size: 100% 100%;
        width: 6px;
        height: 10px;
        margin-left: 10px;
      }
    }
  }
  .title {
    font-size: 12px;
    // padding-left: 15px;
  }
  .title-box {
    line-height: 36px;
    font-size: 13.5px;
    overflow: auto;
    height: calc(100% - 66px);
    min-height: calc(100% - 66px);
    flex: 1;
    & > div {
      display: flex;
      align-items: center;
      padding-left: 15px;
    }
    .nav {
      flex: 1;
      margin-left: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    .playing {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &::after {
        content: "";
        display: inline-block;
        background: url(~@/assets/images/laba.png) no-repeat;
        background-size: 100% 100%;
        width: 12px;
        height: 12px;
        margin-right: 20px;
      }
    }
    .item-icon {
      display: inline-block;
      width: 16px;
      height: 18px;
      filter: brightness(1.5);
      background-size: cover;
      background-repeat: no-repeat;
    }
    .icon-mainPage {
      background-image: url(~@/assets/images/cloud-music.png);
    }
    .icon-ownFm {
      background-image: url(~@/assets/images/guangbo.png);
      background-size: 16px 14px;
      margin-top: 2px;
    }
    .icon-videoNav {
      background-image: url(~@/assets/images/video.png);
      background-size: 16px;
      margin-top: 2px;
    }
    .icon-friendNav {
      background-image: url(~@/assets/images/friend-nav.png);
    }
    .icon-itunesNav {
      background-image: url(~@/assets/images/music.png);
      background-size: 16px;
    }
    .icon-downLoadNav {
      background-image: url(~@/assets/images/download.png);
    }
    .icon-cloudNav {
      background-image: url(~@/assets/images/cloud.png);
      background-size: 16px;
    }
    .icon-radioNav {
      background-image: url(~@/assets/images/radio-nav.png);
      background-size: 16px;
    }
    .icon-collectionNav {
      background-image: url(~@/assets/images/collection.png);
      background-size: 16px;
    }
    .icon-loveList {
      background-image: url(~@/assets/images/heart.png);
    }
    .music-icon {
      background-image: url(~@/assets/images/music-icon.png);
    }
  }
  .active {
    color: #e63b2a;
    background: rgb(27, 27, 27);
    .icon-mainPage {
      background-image: url(~@/assets/images/cloud-music1.png);
    }
    .icon-ownFm {
      background-image: url(~@/assets/images/guangbo1.png);
    }
    .icon-videoNav {
      background-image: url(~@/assets/images/video1.png);
    }
    .icon-friendNav {
      background-image: url(~@/assets/images/friend-nav1.png);
    }
    .icon-itunesNav {
      background-image: url(~@/assets/images/music1.png);
    }
    .icon-downLoadNav {
      background-image: url(~@/assets/images/download1.png);
    }
    .icon-cloudNav {
      background-image: url(~@/assets/images/cloud1.png);
    }
    .icon-radioNav {
      background-image: url(~@/assets/images/radio-nav1.png);
    }
    .icon-collectionNav {
      background-image: url(~@/assets/images/collection1.png);
    }
    .icon-loveList {
      background-image: url(~@/assets/images/heart1.png);
    }
    .music-icon {
      background-image: url(~@/assets/images/music-red.png);
    }
  }
  .item-hover:hover {
    background: rgb(27, 27, 27);
  }
  .border {
    display: block;
    height: 1px;
    width: 100%;
    background: rgb(67, 67, 67);
  }
  .user-detail-box {
    position: fixed;
    top: 10vh;
    left: 15vw;
    width: 32vw;
    height: 58vh;
    background: rgb(54, 54, 54);
    z-index: 99;
    border-radius: 4px;
    font-size: 13px;
    .user-top {
      display: flex;
      text-align: center;
      margin: 20px 20px 0 20px;
      div {
        flex: 1;
        border-right: 1px solid rgb(51, 51, 51);
        p {
          font-size: 30px;
          height: 45px;
        }
        span {
          display: block;
          font-size: 12px;
        }
        &:hover {
          color: rgb(229, 229, 229);
        }
      }
    }
    .sign-box {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      margin: 15px 0;
      .user-sign {
        padding: 4px 20px;
        border-radius: 15px;
        border: 1px solid rgb(84, 84, 84);
        display: flex;
        align-items: center;
        i {
          display: inline-block;
          background: url(~@/assets/images/gold.png) no-repeat;
          background-size: 100% 100%;
          width: 15px;
          height: 12px;
          margin-right: 5px;
        }
        &:hover {
          background: rgb(83, 83, 83);
          i,
          p {
            filter: brightness(2.3);
          }
        }
      }
    }
    .btn-list {
      .btn-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #c3c3c3;
        padding: 0 10px 0 20px;
        &:hover {
          background: rgb(66, 66, 66);
        }
        .btn-title {
          position: relative;
          padding-left: 30px;
          line-height: 40px;
        }
        .vip::before {
          content: "";
          position: absolute;
          background: url(~@/assets/images/vip.png) no-repeat;
          background-size: 100% 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }
        .grade::before {
          content: "";
          position: absolute;
          background: url(~@/assets/images/grade.png) no-repeat;
          background-size: 100% 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }
        .shopping::before {
          content: "";
          position: absolute;
          background: url(~@/assets/images/shopping.png) no-repeat;
          background-size: 100% 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }
        .setting::before {
          content: "";
          position: absolute;
          background: url(~@/assets/images/setting.png) no-repeat;
          background-size: 100% 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }
        .phone::before {
          content: "";
          position: absolute;
          background: url(~@/assets/images/phone.png) no-repeat;
          background-size: 100% 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }
        .switch::before {
          content: "";
          position: absolute;
          background: url(~@/assets/images/switch.png) no-repeat;
          background-size: 100% 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }
      }
      .btn-right {
        position: relative;
        padding-right: 18px;
        color: rgb(92, 92, 92);
        font-size: 12px;
        &::after {
          content: "";
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          background: url(~@/assets/images/next.png) no-repeat;
          background-size: 100% 100%;
          width: 12px;
          filter: brightness(2.3);
          height: 12px;
        }
      }
    }
  }
}
</style>