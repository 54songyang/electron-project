<template>
  <div class="own-menu">
    <div class="own-top"></div>
    <div class="music-body">
      <div
        v-for="(item, index) in menuItem.tracks"
        :class="['item-box', { 'bg-white': active === index }]"
        :key="item.id"
        @click="checkMusic(index)"
      >
        <div class="item-index">{{ index | indexFilter }}</div>
        <div class="item-sc"></div>
        <div class="item-download"></div>
        <div class="item-name">{{ item.name }}</div>
        <div class="singer-name">{{ item.ar[0].name }}</div>
        <div class="item-zj">{{ item.al.name }}</div>
        <div class="item-time">{{ setTime(item.publishTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "ownMenu",
  data() {
    return {
      id: "",
      menuItem: "",
      active: "",
    };
  },
  methods: {
    ...mapMutations(["SET_PLAYLIST"]),
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    setTime(time) {
      time = new Date(time);
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      let hs = h ? `${this.add0(h)}:` : "";
      let mms = mm ? `${this.add0(mm)}:` : "";
      return hs + mms + this.add0(s);
    },
    checkMusic(index) {
      this.active = index;
    },
    getMenuDetail(id) {
      this.$axios({
        type: "get",
        url: `/playlist/detail?id=${this.id}`,
      })
        .then(async (res) => {
          if (res.code === 200) {
            const playlist = res.playlist;
            console.log("获取歌单详情", playlist);
            playlist.tracks.forEach((el) => {
              el.check = false;
            });
            this.SET_PLAYLIST(playlist);
            this.menuItem = playlist;
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // getSongDetail(ids) {
    //   return this.$axios({
    //     type: "get",
    //     url: `/song/url?id=${ids}`,
    //   })
    //     .then((res) => {
    //       if (res.code === 200) {
    //         return res;
    //       }
    //     })
    //     .catch((err) => {
    //       return false;
    //       console.log("err", err);
    //     });
    // },
  },
  filters: {
    indexFilter: (val) => {
      val = val + 1;
      if (val < 10) return "0" + val;
      else return val;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((_this) => {
      _this.id = _this.$route.name.replace("ownMenu", "");
      _this.getMenuDetail();
    });
  },
};
</script>

<style lang="scss" scoped>
.own-menu {
  .own-top {
  }
  .music-body {
    .item-box {
      display: flex;
      align-items: center;
      padding: 0 37px 0 25px;
      font-size: 12px;
      background: rgb(41, 41, 41);
      height: 34px;
      &:nth-child(2n) {
        background: rgb(37, 37, 37);
      }
      &:hover {
        background: rgb(50, 50, 50);
      }
      .item-index {
        font-size: 12px;
        color: rgb(91, 91, 91);
        width: 30px;
      }
      .item-sc {
        background: url(~@/assets/images/sc-white.png) no-repeat;
        background-size: 100% 100%;
        width: 14px;
        height: 13px;
        margin: 0 8px;
      }
      .item-download {
        background: url(~@/assets/images/xz.png) no-repeat;
        background-size: 100% 100%;
        width: 18px;
        height: 15px;
        margin: 0 6px;
      }
      .item-name {
        color: rgb(179, 179, 179);
        flex: 1;
      }
      .singer-name {
        color: rgb(131, 131, 131);
        flex: 1;
      }
      .item-zj {
        color: rgb(131, 131, 131);
        flex: 1;
      }
      .item-time {
        color: rgb(89, 89, 89);
        width: 30px;
      }
    }
    .bg-white {
      background: rgb(50, 50, 50) !important;
    }
  }
}
</style>