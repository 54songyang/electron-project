<template>
  <div class="login-page">
    <div class="top-cli">
      <i @click="closePage"></i>
      <div
        class="check-active"
        v-show="active === 1"
        @click="checkActive(0)"
      ></div>
      <div class="login-top-img" v-show="active === 1"></div>
    </div>
    <div class="login-qr-body" v-show="active === 0">
      <div class="login-tip">扫码登录</div>
      <div :class="['example-box', { 'hover-qr': !overdue }]">
        <div class="img-box">
          <img class="example" src="@/assets/images/login-1.png" alt="" />
        </div>
        <div class="qr-box">
          <img :src="baseUrl" alt="" />
          <div class="qr-overdue" v-show="overdue">
            <div class="refresh-title">二维码已失效</div>
            <div class="refresh-qr" @click="qrLogin">点击刷新</div>
          </div>
        </div>
        <div class="bottom-tip-box">
          <div class="bottom-tip">
            使用<span @click="openApp('https://music.163.com/download')"
              >网易云音乐App</span
            >扫码登录
          </div>
        </div>
      </div>
      <div class="login-else" @click="checkActive(1)">
        选择其他登录模式<i></i>
      </div>
    </div>
    <div class="login-phone-body" v-show="active !== 0">
      <img class="login-img" src="@/assets/images/login-2.png" alt="" />
      <div class="input-box">
        <div class="account-box">
          <img class="account-icon" src="@/assets/images/account-1.png" />
          <div class="account-head">+89</div>
          <img
            class="account-down"
            src="@/assets/images/account-2.png"
            alt=""
          />
          <div class="account-body">
            <input
              type="text"
              @blur="inputBlur"
              v-model="phoneNum"
              placeholder="请输入手机号"
            />
            <!-- <input
              v-show="active === 2"
              type="text"
              @blur="inputBlur"
              v-model="phoneNum"
              placeholder="请输入手机号"
            /> -->
          </div>
        </div>
        <div class="password-box">
          <img class="password-icon" src="@/assets/images/password-1.png" />
          <input
            type="password"
            @blur="inputBlur"
            v-model="password"
            :placeholder="active === 2 ? '设置登录密码' : '请输入密码'"
          />
          <div
            class="reset-password"
            v-show="active === 1"
            @click="checkActive(3)"
          >
            重设密码
          </div>
        </div>
      </div>
      <div class="error-tip-box">
        <div
          class="registered-tip"
          v-show="(active === 2 || active === 3) && !errorTip"
        >
          密码8-20位，至少包含字母/数字/字符2种组合
        </div>
        <div class="login-tip" v-show="errorTip"><i></i>{{ errorTip }}</div>
      </div>
      <div class="login-btn" @click="phoneLogin" @keydown="phoneLogin">
        {{ active | btnFilter }}
      </div>
      <div class="registered" v-show="active === 1">
        <span @click="checkActive(2)">注册</span>
      </div>
      <div class="other-title" v-show="active === 2">其他注册方式</div>
      <img
        v-show="active !== 3"
        class="login-other"
        src="@/assets/images/login-3.png"
        alt=""
      />
      <div class="clause-box" v-show="active === 1">
        <img
          :src="isRead ? clauseOk : clauseNo"
          @click="isRead = !isRead"
          alt=""
        />
        同意<span
          @click="openApp('https://st.music.163.com/official-terms/service')"
          >《服务条款》</span
        ><span
          @click="openApp('https://st.music.163.com/official-terms/privacy')"
          >《隐私政策》</span
        ><span
          @click="openApp('https://st.music.163.com/official-terms/children')"
          >《儿童隐私政策》</span
        >
      </div>
      <div
        class="back-login"
        v-show="active === 2 || active === 3"
        @click="active = 1"
      >
        返回登录
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "",
  data() {
    return {
      unikey: "",
      baseUrl: "",
      timer: null,
      active: 0,
      phoneNum: "m13522499772@163.com", //手机号
      password: "songyang123", //密码
      errorTip: "",
      isRead: false,
      overdue: false, //二维码过期
      clauseOk: require("@/assets/images/login-ok.png"),
      clauseNo: require("@/assets/images/login-no.png"),
    };
  },
  watch: {
    active(val) {
      if (val) {
        clearInterval(this.timer);
        this.timer = null;
      } else {
        this.qrLogin();
      }
    },
  },
  methods: {
    ...mapActions([
      "getQrKey",
      "getQrcode",
      "loginStatus",
      "getQrCheck",
      "userLogin",
    ]),
    async qrLogin() {
      try {
        this.loginStatus();
        const unikey = await this.getQrKey();
        this.unikey = unikey;
        const baseUrl = await this.getQrcode(this.unikey);
        this.baseUrl = baseUrl;
        this.overdue = false;
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.timer = setInterval(async () => {
          const statusRes = await this.getQrCheck(this.unikey);
          if (statusRes.code === 800) {
            this.overdue = true;
            clearInterval(this.timer);
          }
          if (statusRes.code === 803) {
            // 这一步会返回cookie
            clearInterval(this.timer);
            this.$electron.ipcRenderer.send("toLogin");
            this.$electron.ipcRenderer.send("closeLogin");
          }
        }, 3000);
      } catch (error) {
        console.log("error");
        clearInterval(this.timer);
      }
    },
    async phoneLogin() {
      const res = await this.userLogin({
        account: this.phoneNum,
        password: this.password,
      });
      if (res.code === 200) {
        this.$electron.ipcRenderer.send("toLogin");
      }
      this.$electron.ipcRenderer.send("closeLogin");
      if (!this.phoneNum) {
        this.errorTip = "请输入手机号";
        return;
      } else if (!this.password) {
        this.errorTip = "请输入密码";
        return;
      }
    },
    openApp(url) {
      this.$electron.shell.openExternal(url);
    },
    checkActive(num) {
      this.active = num;
    },
    closePage() {
      clearInterval(this.timer);
      this.timer = null;
      this.$electron.ipcRenderer.send("closeLogin");
    },
    inputBlur() {
      this.errorTip = "";
    },
  },
  filters: {
    btnFilter(val) {
      if (val === 1) return "登\n录";
      else if (val === 2) return "注\n册";
      else if (val === 3) return "下一步";
    },
  },
  async mounted() {
    console.log(
      "%c 当前环境 => 登录页 ",
      `color:${
        process.env.VUE_APP_MODE === "development" ? "#00a050" : "#fd9d0a"
      };-webkit-background-clip: text;font-size:15px;`
    );
    this.qrLogin(); //验证码登录
  },
  beforeRouteEnter(to, from, next) {
    next((_this) => {});
  },
};
</script>
<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background: #fff;
  & * {
    cursor: default;
  }
  .top-cli {
    position: fixed;
    width: 100%;
    height: 50px;
    top: 0;
    right: 0;
    z-index: 100;
    -webkit-app-region: drag;
    cursor: pointer;
    i {
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url(~@/assets/images/delete-login2.png) no-repeat;
      background-size: 100% 100%;
      margin: 13px 0 0 13px;
      &:hover {
        background: url(~@/assets/images/delete-login.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .check-active {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    z-index: 3;
  }
  .login-top-img {
    background: url(~@/assets/images/login-top.png) no-repeat;
    background-size: 100% 100%;
    width: 161.5px;
    height: 51.5px;
    position: absolute;
    right: 0;
    top: 0;
  }
  .login-qr-body {
    padding-top: 92px;
    .login-tip {
      height: 40px;
      font-size: 28px;
      color: rgb(51, 51, 51);
      text-align: center;
      font-family: PingFangSC-Medium, PingFang SC;
    }
    .example-box {
      padding: 0 26px;
      position: relative;
      .img-box {
        .example {
          position: absolute;
          top: 0;
          width: 132px;
          height: 240px;
          opacity: 0;
          transform: translateX(100px);
          transition: transform linear 0.3s, opacity linear 0.3s;
          z-index: 1;
        }
      }
      .qr-box {
        width: 205px;
        height: 205px;
        margin: 12px auto 0 auto;
        position: relative;
        z-index: 2;
        img {
          display: block;
          transition: transform linear 0.3s, width linear 0.3s,
            height linear 0.3s;
          width: 100%;
          height: 100%;
          background: #fff;
          z-index: 3;
        }
        .qr-overdue {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #fff;
          z-index: 10px;
          .refresh-title {
            font-size: 14px;
          }
          .refresh-qr {
            background: rgb(195, 70, 58);
            padding: 0 13px;
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            margin-top: 16px;
          }
        }
      }
      .bottom-tip-box {
        display: flex;
        justify-content: center;
        .bottom-tip {
          font-size: 14px;
          text-align: center;
          span {
            color: rgb(50, 115, 188);
          }
        }
      }
    }
    // !!!
    .hover-qr:hover {
      .example {
        transform: translateX(0px);
        opacity: 1;
      }
      .qr-box {
        height: 170px;
        img {
          width: 150px;
          height: 150px;
          transform: translate(110px, 20px);
        }
      }
      .bottom-tip-box {
        justify-content: flex-end;
        .bottom-tip {
          width: 130px;
        }
      }
    }
    .login-else {
      color: rgb(109, 109, 109);
      font-size: 12px;
      text-align: center;
      margin-top: 85px;
      i {
        display: inline-block;
        background: url(~@/assets/images/login-xy.png) no-repeat;
        background-size: 100% 100%;
        width: 12px;
        height: 12px;
        vertical-align: -2px;
        margin-left: 2px;
      }
    }
  }
  .login-phone-body {
    .login-img {
      width: 100%;
    }
    .input-box {
      margin: 0 40px;
      border: 1px solid rgb(217, 217, 217);
      border-radius: 4px;
      .account-box {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgb(229, 229, 229);
        .account-icon {
          display: block;
          width: 11px;
          height: 16px;
          margin: 3px 10px 3px 10px;
        }
        .account-head {
          font-size: 12px;
          width: 35px;
        }
        .account-down {
          display: block;
          width: 9px;
          height: 5px;
          margin-right: 9px;
        }
        .account-body {
          flex: 1;
          padding: 10px 9px;
          border-left: 1px solid rgb(217, 217, 217);
          font-family: PingFangSC-Medium;
        }
      }
      .password-box {
        display: flex;
        line-height: 17px;
        padding: 10px 0;
        align-items: center;
        font-size: 12px;
        .password-icon {
          display: block;
          width: 13px;
          height: 16px;
          margin: 0.5px 10px 0.5px 10px;
        }
        .reset-password {
          width: 82px;
          text-align: center;
          color: rgb(181, 181, 181);
        }
      }
      input {
        display: block;
        flex: 1;
        outline: none;
        border: none;
        background: none;
        line-height: 17px;
        width: 100%;
        &::-webkit-input-placeholder {
          color: rgb(171, 171, 171);
          font-size: 12px;
        }
      }
    }
    .login-btn {
      font-size: 15px;
      color: #fff;
      background: rgb(187, 68, 56);
      line-height: 40px;
      height: 40px;
      margin: 0 40px;
      border-radius: 4px;
      text-align: center;
    }
    .error-tip-box {
      height: 40px;
      .login-tip {
        font-size: 12px;
        text-align: right;
        margin: 0 40px;
        color: rgb(190, 70, 85);
        line-height: 40px;
        i {
          display: inline-block;
          background: url(~@/assets/images/login-tip.png) no-repeat;
          background-size: 100% 100%;
          width: 14px;
          height: 14px;
          vertical-align: -3px;
          margin-right: 3px;
        }
      }
      .registered-tip {
        color: rgb(177, 177, 177);
        font-size: 12px;
        padding-left: 40px;
        line-height: 30px;
      }
    }
    .registered {
      text-align: center;
      text-decoration: underline;
      line-height: 50px;
    }
    .other-title {
      font-size: 12px;
      color: rgb(113, 113, 113);
      text-align: center;
      margin: 47px 0 15px 0;
    }
    .login-other {
      display: block;
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
    }
    .clause-box {
      display: flex;
      align-items: center;
      font-size: 10px;
      color: rgb(176, 176, 176);
      padding: 35px 0 0 40px;
      img {
        display: block;
        width: 10px;
        height: 10px;
        margin-right: 8px;
      }
      span {
        color: rgb(93, 128, 173);
      }
    }
    .back-login {
      position: absolute;
      text-align: center;
      color: rgb(109, 109, 109);
      font-size: 12px;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>