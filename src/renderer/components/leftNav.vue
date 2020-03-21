<template>
  <div class="nav-body">
    <div class="user-box" @click.stop="showUserDetail = !showUserDetail">
      <img
        :src="userInfo.profile.avatarUrl||'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3256100974,305075936&fm=26&gp=0.jpg'"
        alt
      />
      <p class="user-name">{{userInfo.profile.nickname}}</p>
      <i class="user-detail" @click="openDetail"></i>
    </div>
    <div
      class="title-box"
      v-for="(item,index) in navList"
      :key="index"
      @click="selectPage(item.nav,index)"
      :class="['item',{'item-hover':item.nav},{active:active === index}]"
    >
      <div>
        <Icon v-if="item.nav" type="ios-people" />
        <p :class="[item.nav?'nav':'title']">{{item.nav?item.nav:item.title}}</p>
      </div>
    </div>
    <div class="user-detail-box cloud-pop-box" v-ownShow="showUserDetail">
      <!-- v-if="showUserDetail" -->
      <div class="user-top">
        <div @click="toList">
          <p>{{userInfo.profile.eventCount}}</p>
          <span>动态</span>
        </div>
        <div @click="toList">
          <p>{{userInfo.profile.follows}}</p>
          <span>关注</span>
        </div>
        <div @click="toList">
          <p>{{userInfo.profile.followeds}}</p>
          <span>粉丝</span>
        </div>
      </div>
      <div class="sign-box">
        <div class="user-sign">
          <i></i>
          <p>签到</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "leftNav",
  props: ["navList", "userInfo"],
  data() {
    return {
      active: 0,
      showUserDetail: false
    };
  },
  methods: {
    selectPage(check, index) {
      if (!check) return;
      this.active = index;
      if (index === 0) {
        this.$router.push("mainPage");
      }
    },
    toList() {
      this.$router.push({
        name: "userPage",
        params: {
          userId: this.userInfo.profile.userId
        }
      });
    },
    openDetail() {}
  },
  directives: {
    ownShow: {
      bind: function(el, binding, vnode) {
        el.style.display = binding.value ? "block" : "none";
      },
      update: function(el, binding, vnode) {
        let _this = vnode.context,
          value = binding.value,
          bindData = binding.expression;
        if (!value) {
          el.style.display = "none";
          _this[bindData] = false;
        } else {
          el.style.display = "block";
          _this[bindData] = true;
          let handFn = function(e) {
            if (!el.contains(e.target)) {
              el.style.display = "none";
              _this[bindData] = false;
              document.body.removeEventListener("click", handFn, false);
            }
          };
          document.body.addEventListener("click", handFn);
        }
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.nav-body {
  display: flex;
  flex-direction: column;
  width: 196px;
  background: rgb(32, 32, 32);
  min-height: 100vh;
  color: rgb(177, 177, 177);
  .user-box {
    display: flex;
    align-items: center;
    padding: 15px;
    img {
      display: block;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .user-name {
      font-size: 14px;
      line-height: 18px;
      margin-left: 10px;
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
  .title {
    font-size: 12px;
    padding-left: 15px;
  }
  .active {
    background: rgb(27, 27, 27);
    color: red;
  }
  .title-box {
    line-height: 36px;
    font-size: 14px;
    padding-left: 15px;
    & > div {
      display: flex;
      align-items: center;
    }
    .nav {
      flex: 1;
      margin-left: 10px;
    }
  }
  .item-hover:hover {
    background: rgb(27, 27, 27);
  }
  .user-detail-box {
    position: fixed;
    top: 10vh;
    left: 15vw;
    width: 30vw;
    height: 58vh;
    background: rgb(54, 54, 54);
    z-index: 99;
    border-radius: 4px;
    .user-top {
      display: flex;
      text-align: center;
      margin: 20px 20px 0 20px;
      div {
        flex: 1;
        border-right: 1px solid rgb(51, 51, 51);
        p {
          font-size: 30px;
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
      margin-top: 15px;
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
  }
}
</style>