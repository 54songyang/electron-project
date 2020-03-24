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
    <mySwiper v-if="bannerList.length>0" :list="bannerList" :autoPlay="true" class="swiper-box"></mySwiper>
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
      bannerList: []
    };
  },
  mounted() {
    this.$axios({
      type: "get",
      url: `banner?type=0`
    })
      .then(res => {
        console.log("banners", res.data.banners);
        if (res.status === 200) this.bannerList = res.data.banners;
      })
      .catch(err => {
        console.log("err", err);
      });
  }
};
</script>

<style lang="scss" scoped>
.main-page {
  margin: 0 15px;
  .swiper-box {
    width: calc(100vw - 226px);
    height: 34.18vh;
    margin-top: 15px;
  }
}
</style>