<template>
  <div class="list-body" ref="listBody">
    <div class="tab-body" @mousewheel.prevent>
      <div class="tab-box">
        <div
          :class="!tabActive ? 'active' : 'no-acitve'"
          @click="tabActive = false"
        >
          播放列表
        </div>
        <div
          :class="tabActive ? 'active' : 'no-acitve'"
          @click="tabActive = true"
        >
          历史记录
        </div>
      </div>
    </div>
    <div class="title-box" @mousewheel.prevent>
      <div class="total">总{{ musicList.length }}首</div>
      <div class="sc"><i></i>收藏全部</div>
      <div class="delete"><i></i>清空</div>
    </div>
    <div
      class="list-box"
      v-if="Array.isArray(musicList) && musicList.length > 0"
      @scroll="scrollFn"
    >
      <div class="scroll-box" ref="scrollBox">
        <div
          :class="['list-item', { 'active-music': active === index }]"
          v-for="(item, index) in musicList"
          :key="item.id"
          @dblclick="selectsong(item, index)"
        >
          <div class="music-title ellipsis">
            <div class="name-box">
              <span>{{ item.name }}</span>
              <span class="name-tip" v-if="item.alia.length > 0"
                ><em>({{ item.alia.join("/") }})</em></span
              >
            </div>
            <span
              v-if="item.h.vd <= 0 || item.l.vd <= 0 || item.m.vd <= 0"
              class="sq"
            ></span>
            <span class="mv" v-if="item.mv"></span>
          </div>
          <div class="music-singer ellipsis">
            {{ item.ar.map((el) => el.name).join("/") }}
          </div>
          <div class="music-link"></div>
          <div class="music-time">04:36</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "musicList",
  data() {
    return {
      tabActive: false,
      scrollTop: "",
    };
  },
  computed: {
    musicList() {
      return this.$store.state.music.videoUpload.musicList;
    },
    active() {
      return this.$store.state.music.videoUpload.active;
    },
  },
  methods: {
    ...mapMutations(["SET_MUSICLIST"]),
    ...mapActions(["canUse", "musicDetail", "musicUrl", "musicLrc"]),
    scrollFn(e) {
      this.scrollTop = e.target.scrollTop;
    },
    async selectsong({ id }, index) {
      // if (index === this.active) console.log("已开始播放！");
      // try {
      //   const canUse = await this.canUse(id);
      //   const {
      //     name: title,
      //     al: { picUrl },
      //     ar: [{ name: artist }],
      //   } = await this.musicDetail(id);
      //   const { url: src } = await this.musicUrl(id);
      //   const lrc = await this.musicLrc(id);
      //   const song = {
      //     artist,
      //     title,
      //     pic: picUrl,
      //     src,
      //     lrc,
      //   };
      //   this.$emit("selectsong", song);
      //   this.SET_MUSIC({ index, song });
      //   console.log("song",song);
      // } catch (error) {
      //   console.log("error", error);
      // }
    },
  },
  // mounted() {
  //   this.SET_MUSICLIST([
  //     {
  //       name: "赤伶",
  //       id: 1377748865,
  //       pst: 0,
  //       t: 0,
  //       ar: [
  //         {
  //           id: 32674400,
  //           name: "是二智呀",
  //           tns: [],
  //           alias: [],
  //         },
  //       ],
  //       alia: [],
  //       pop: 100,
  //       st: 0,
  //       rt: "",
  //       fee: 8,
  //       v: 17,
  //       crbt: null,
  //       cf: "",
  //       al: {
  //         id: 81406182,
  //         name: "赤伶（民谣版）",
  //         picUrl:
  //           "https://p2.music.126.net/R9d4-eULOknTXf4fZz41Dg==/109951164346847770.jpg",
  //         tns: [],
  //         pic_str: "109951164346847770",
  //         pic: 109951164346847780,
  //       },
  //       dt: 265588,
  //       h: {
  //         br: 320000,
  //         fid: 0,
  //         size: 10626285,
  //         vd: -13769,
  //       },
  //       m: {
  //         br: 192000,
  //         fid: 0,
  //         size: 6375789,
  //         vd: -11159,
  //       },
  //       l: {
  //         br: 128000,
  //         fid: 0,
  //         size: 4250541,
  //         vd: -9469,
  //       },
  //       a: null,
  //       cd: "01",
  //       no: 1,
  //       rtUrl: null,
  //       ftype: 0,
  //       rtUrls: [],
  //       djId: 0,
  //       copyright: 0,
  //       s_id: 0,
  //       mark: 64,
  //       originCoverType: 2,
  //       originSongSimpleData: {
  //         songId: 1313118277,
  //         name: "赤伶",
  //         artists: [
  //           {
  //             id: 7898,
  //             name: "HITA",
  //           },
  //         ],
  //         albumMeta: {
  //           id: 73611844,
  //           name: "赤伶",
  //         },
  //       },
  //       single: 0,
  //       noCopyrightRcmd: null,
  //       mv: 0,
  //       rtype: 0,
  //       rurl: null,
  //       mst: 9,
  //       cp: 0,
  //       publishTime: 1562947200000,
  //     },
  //     {
  //       name: "明月天涯",
  //       id: 416388799,
  //       pst: 0,
  //       t: 0,
  //       ar: [
  //         {
  //           id: 1047237,
  //           name: "五音Jw",
  //           tns: [],
  //           alias: [],
  //         },
  //       ],
  //       alia: [],
  //       pop: 100,
  //       st: 0,
  //       rt: "",
  //       fee: 8,
  //       v: 83,
  //       crbt: null,
  //       cf: "",
  //       al: {
  //         id: 34729337,
  //         name: "聆音",
  //         picUrl:
  //           "https://p2.music.126.net/m3E8aIuHCZ1qGg1WEN2VFA==/17981413160792921.jpg",
  //         tns: [],
  //         pic_str: "17981413160792921",
  //         pic: 17981413160792920,
  //       },
  //       dt: 241793,
  //       h: {
  //         br: 320000,
  //         fid: 0,
  //         size: 9682068,
  //         vd: -12300,
  //       },
  //       m: {
  //         br: 192000,
  //         fid: 0,
  //         size: 5809258,
  //         vd: -9900,
  //       },
  //       l: {
  //         br: 128000,
  //         fid: 0,
  //         size: 3872853,
  //         vd: -8600,
  //       },
  //       a: null,
  //       cd: "1",
  //       no: 1,
  //       rtUrl: null,
  //       ftype: 0,
  //       rtUrls: [],
  //       djId: 0,
  //       copyright: 0,
  //       s_id: 0,
  //       mark: 0,
  //       originCoverType: 1,
  //       originSongSimpleData: null,
  //       single: 0,
  //       noCopyrightRcmd: null,
  //       mv: 0,
  //       rtype: 0,
  //       rurl: null,
  //       mst: 9,
  //       cp: 0,
  //       publishTime: 1465451119429,
  //     },
  //   ]);
  // },
};
</script>
<style lang="scss" scoped>
.list-body {
  position: fixed;
  top: 51px;
  right: 0;
  width: 420px;
  background: rgb(54, 54, 54);
  z-index: 120;
  height: calc(100% - 110px);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0px 20px -20px #000000;
  .list-box {
    flex: 1;
    overflow-y: auto;
    .list-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: rgb(185, 185, 185);
      padding: 0 47px 0 20px;
      line-height: 33px;
      height: 33px;
      background: rgb(54, 54, 54);
      &:nth-child(2n) {
        background: rgb(58, 58, 58);
      }
      &:not(.active-music):hover {
        background: rgb(62, 62, 62);
        .music-title,
        .music-singer,
        .music-time {
          color: #fff;
        }
      }
      .music-title {
        flex: 1;
        display: flex;
        align-items: center;
        .name-box {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .name-tip {
          display: inline-block;
          color: #b9b9b9;
          margin-left: 4px;
          em {
            color: rgb(90, 90, 90);
          }
        }
        .sq {
          display: block;
          background: url(~@/assets/images/sq-2.png) no-repeat;
          background-size: 100% 100%;
          width: 15px;
          height: 12px;
          min-width: 17px;
          margin: 0 4px;
        }
        .mv {
          display: block;
          background: url(~@/assets/images/video-red.png) no-repeat;
          background-size: 100% 100%;
          width: 16px;
          height: 15px;
          min-width: 17px;
          margin: 0 4px;
        }
      }
      .music-link {
        background: url(~@/assets/images/link.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 15px;
      }
      .music-singer {
        color: rgb(145, 145, 145);
        width: 94px;
      }
      .music-time {
        color: rgb(145, 145, 145);
        text-align: right;
        width: 47px;
      }
      .ellipsis {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .active-music {
      .music-title,
      .music-singer {
        color: rgb(187, 69, 57);
      }
    }
  }
  .tab-body {
    padding: 20px 0 12px 0;
    display: flex;
    justify-content: center;
    .tab-box {
      width: 210px;
      line-height: 28px;
      height: 28px;
      font-size: 14px;
      text-align: center;
      display: flex;
      color: rgb(173, 173, 173);
      border: 1px solid rgb(102, 102, 102);
      border-radius: 15px;
      div {
        flex: 1;
        border-radius: 14px;
        height: 28px;
      }
      .no-acitve:hover {
        background: rgb(62, 62, 62);
        color: #fff;
      }
      .active {
        background: rgb(102, 102, 102);
        color: #fff;
      }
    }
  }
  .title-box {
    display: flex;
    font-size: 14px;
    color: rgb(173, 173, 173);
    justify-content: space-between;
    height: 40px;
    align-items: center;
    border-bottom: 1px solid rgb(64, 64, 64);
    box-sizing: border-box;
    margin-left: 20px;
    .total {
      font-size: 12px;
      color: rgb(91, 91, 91);
      width: 46.2%;
    }
    .sc {
      i {
        display: inline-block;
        background: url(~@/assets/images/sc-all.png) no-repeat;
        background-size: 100% 100%;
        width: 17px;
        height: 17px;
        vertical-align: -3px;
        margin-right: 4px;
      }
    }
    .delete {
      padding-right: 20px;
      i {
        display: inline-block;
        background: url(~@/assets/images/delete-all.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 17px;
        vertical-align: -3px;
        margin-right: 4px;
      }
    }
  }
}
</style>