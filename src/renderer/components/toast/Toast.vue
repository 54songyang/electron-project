<template>
  <div class="toast">
    <div class="toast-body" v-show="isShow">
      <i class="error-toast"></i>
      <div>{{ message }}</div>
    </div>
    <div class="toast-keep" v-show="forbidClick"></div>
  </div>
</template>
 
<script>
export default {
  name: "Toast",
  data() {
    return {
      message: "",
      isShow: false,
      forbidClick: false,
      timer: null,
    };
  },
  methods: {
    show(arg) {
      return new Promise((resolve) => {
        let duration;
        if (typeof arg === "string") {
          // 字符串直接提示
          this.message = arg;
        } else if (typeof arg === "object") {
          this.message = arg.message;
          duration = arg.duration;
        }
        this.isShow = true;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        if (arg.forbidClick) this.forbidClick = true; //是否禁止背景点击
        this.timer = setTimeout(() => {
          this.isShow = false;
          this.forbidClick = false;
          this.message = "";
          clearTimeout(this.timer);
          this.timer = null;
          resolve(); //弹窗关闭回调，使用then接受收
        }, duration || 1500);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.toast {
  .toast-body {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 28px 40px;
    color: #fff;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    font-size: 18px;
    line-height: 18px;
    .error-toast {
      display: block;
      background: url(~@/assets/images/error-toast.png) no-repeat;
      background-size: 100% 100%;
      width: 30px;
      height: 30px;
      margin-right: 15px;
    }
  }
  .toast-keep {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100000;
  }
}
</style>