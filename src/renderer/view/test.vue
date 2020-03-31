<template>
  <div>
    <!-- <aplayer :music="videoUpload.music"></aplayer> -->
  </div>
</template>

<script>
// import aplayer from "vue-aplayer";
export default {
  name: "test",
  components: {
    // aplayer
  },
  data() {
    return {
      videoUpload: {
        progress: false,
        progressPercent: 0,
        successPercent: 0,
        music: {
          title: "Preparation",
          author: "Hans Zimmer/Richard Harvey",
          url:
            "http://rn01.sycdn.kuwo.cn/9979373057809d7aeadedb3f23e86eaa/5e71db9e/resource/n2/38/17/2710717364.mp3",
          pic:
            "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg",
          lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
        }
      }
    };
  }
};
</script>

<style>
</style>