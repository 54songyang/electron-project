<template>
  <div class="main-page-top">
    <div
      v-for="(item,index) in topList"
      :key="index"
      @click="changeActiveFn(item)"
      :class="{'active-nav':$route.meta.topNav === index}"
    >{{item.name}}</div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "mainPageTop",
  props: ["topData"],

  computed: {
    topList() {
      return this.$store.state.page.topNav;
    }
  },
  methods: {
    changeActiveFn(item) {
      this.$router.push(item.path);
    }
  }
};
</script>
<style lang="scss" scoped>
.top-tool {
  .main-page-top {
    display: flex;
    align-items: center;
    width: 427px;
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
  .user-page-title {
    font-size: 14px;
    color: #fff;
    p {
      display: inline-block;
      color: rgb(126, 126, 126);
    }
  }
}
</style>
