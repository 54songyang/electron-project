<template>
  <div class="fllow-body">
    <div class="item-box" v-if="list && list.length > 0">
      <div class="user-item" v-for="item in list" :key="item.userId">
        <div class="photo-box">
          <img class="user-img" :src="item.avatarUrl" alt />
        </div>
        <div class="user-info">
          <p class="user-name">{{ item.nickname }}</p>
          <div class="user-des">{{ item.signature }}</div>
          <div class="user-own">
            <span class="menu-list">歌单：{{ item.playlistCount }}</span>
            <i></i>
            <span class="follows">粉丝：{{ item.followeds }}</span>
          </div>
        </div>
        <div class="chat-btn"><i></i>私信</div>
      </div>
    </div>
    <div class="no-from" v-if="Array.isArray(list) && list.length === 0">
      暂无{{ query.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "userPage",
  data() {
    return {
      list: null,
    };
  },
  computed: {
    query() {
      return this.$route.query;
    },
  },
  watch: {
    "$route.query.from": "getList",
  },
  methods: {
    getList() {
      this.list = null;
      if (!this.query.userId) this.$router.push("mainPage");
      this.$axios({
        type: "get",
        url: `user/${this.query.from}?uid=${this.query.userId}`,
      })
        .then((res) => {
          if (res.code === 200) {
            if (this.query.from === "follows") this.list = res.follow;
            if (this.query.from === "followeds") this.list = res.followeds;
            if (this.query.from === "event") this.list = res.events;
          }
          console.log("userlist", this.list);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.fllow-body {
  .item-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 10px;
    .user-item {
      width: calc(50% - 60px);
      display: flex;
      align-items: center;
      padding: 10px 30px;
      .photo-box {
        margin-right: 10px;
        .user-img {
          display: block;
          border-radius: 50%;
          width: 88px;
          height: 88px;
          color: rgb(176, 176, 176);
        }
      }
      .user-info {
        color: rgb(135, 135, 135);
        font-size: 12px;
        overflow: hidden;
        margin-right: 10px;
        flex: 1;
        .user-name {
          color: rgb(176, 176, 176);
          font-size: 14px;
          margin-bottom: 10px;
          &:hover {
            filter: brightness(2.3);
          }
        }
        .user-des {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .user-own {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .menu-list {
            line-height: 12px;
          }
          i{
            display: block;
            width: 1px;
            height: 10px;
            background: rgb(83, 83, 83);
          }
          // .follows {
          // }
        }
      }
      .chat-btn {
        width: 65px;
        flex: none;
        color: rgb(179, 179, 179);
        border: 1px solid rgb(66, 66, 66);
        border-radius: 11.5px;
        height: 23px;
        text-align: center;
        font-size: 12px;
        line-height: 23px;
        &:hover {
          background: rgb(83, 83, 83);
          color: #fff;
          i {
            filter: brightness(2.3);
          }
        }
        i {
          display: inline-block;
          background: url(~@/assets/images/xin.png) no-repeat;
          background-size: 100% 100%;
          width: 12px;
          height: 16px;
          margin-right: 6px;
          vertical-align: -4px;
        }
      }
      &:hover {
        background: rgb(41, 41, 41);
      }
    }
  }
  .no-from {
    color: #fff;
    margin-top: 200px;
    text-align: center;
  }
}
</style>