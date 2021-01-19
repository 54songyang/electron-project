<template>
  <div class="own-menu" v-if="playMenu">
    <div class="own-top"></div>
  </div>
</template>

<script>
export default {
  name: "ownMenu",
  data() {
    return {
      
    };
  },
  watch:{
    // playMenu(){
    //   console.log("123",this.pageActive);
    //   this.$route.meta.pageNav = this.pageActive
    //   console.log("v",this.$route.meta.pageNav);
    // }
},
  computed: {
    playMenu() {
      return this.$store.state.page.playMenu;
    },
    pageActive(){
      return this.$store.state.page.pageActive
    }
  },
  // activated() {
  //   console.log("123",);
  //   this.$route.meta.pageNav = 12
  // },
};
</script>

<style>
</style>