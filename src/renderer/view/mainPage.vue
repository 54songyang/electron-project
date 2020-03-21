<template>
  <div class="main-page">
    <!-- <img
      v-if="imgShow"
      @click="imgShow=!imgShow"
      id="logo"
    "~@/assets/images/timg.jpeg"
      alt="electron-vue"
    />
    <img
      v-ele
      id="logo"
      @click="imgShow=!imgShow"
    "~@/assets/images/timg2.jpg"
      alt="electron-vue"
    />-->
    <!-- <button @clik="open('https://baike.baidu.com/item/%E7%9A%AE%E7%9A%AE%E8%99%BE/9680382')">皮皮虾</button> -->
    <mySwiper :list="list" :autoPlay="true" class="swiper-box"></mySwiper>
  </div>
</template>

<script>
import mySwiper from "@/components/my-swiper";
export default {
  name: "mainPage",
  components: {
    mySwiper
  },
  data() {
    return {
      imgShow: true,
      list: [
        "http://img3.imgtn.bdimg.com/it/u=1970368607,3500779700&fm=26&gp=0.jpg",
        "http://img3.imgtn.bdimg.com/it/u=403810582,2864351555&fm=26&gp=0.jpg",
        "http://img3.imgtn.bdimg.com/it/u=1481652703,2245130276&fm=26&gp=0.jpg",
        "http://img0.imgtn.bdimg.com/it/u=1350315569,2035703227&fm=26&gp=0.jpg",
        "http://img0.imgtn.bdimg.com/it/u=3075048587,728988847&fm=26&gp=0.jpg",
        "http://img5.imgtn.bdimg.com/it/u=1329555386,3575948425&fm=26&gp=0.jpg",
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3838312022,943518749&fm=26&gp=0.jpg",
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=328616222,1885605737&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1073553599,3321740403&fm=26&gp=0.jpg"
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.main-page {
  margin: 0 15px;
  .swiper-box {
    width: calc(100vw - 226px);
    height: 34.18vh;
    margin-top:15px;
  }
}
</style>