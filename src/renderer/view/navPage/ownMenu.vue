<template>
  <div class="own-menu" v-if="menuItem">
    <transition name="fade">
      <div class="own-title" v-show="titleShow">
        <div class="title-name">{{ menuItem.name }}</div>
        <div class="title-btn">
          <div class="play-all"></div>
          <div class="title-sc"></div>
          <div class="share"></div>
          <div class="download"></div>
        </div>
      </div>
    </transition>
    <div class="own-top">
      <img
        class="own-pic"
        v-lazy="{ src: menuItem.coverImgUrl, error: imgError }"
        alt=""
      />
      <div class="info-box">
        <div class="own-name"><span>歌单</span>{{ menuItem.name }}<i></i></div>
        <div class="user-name">
          <img :src="userInfo.profile.avatarUrl" alt="" />
          <div class="name">{{ userInfo.profile.nickname }}</div>
          <div class="time">{{ menuItem.createTime | timeFilter }}创建</div>
        </div>
        <div class="btn-box">
          <div class="btn-play">
            <div class="btn-left"><i></i>播放全部</div>
            <div class="btn-right"></div>
          </div>
          <div class="btn-sc hover-btn"><i></i>收藏(0)</div>
          <div class="btn-share hover-btn"><i></i>分享(0)</div>
          <div class="btn-down hover-btn"><i></i>下载全部</div>
        </div>
        <div class="tag">
          标&nbsp;&nbsp;签：
          <span>添加标签</span>
        </div>
        <div class="info-content">
          <div>
            歌曲数：<span>{{ menuItem.trackCount }}</span>
          </div>
          <div>播放数：<span>0</span></div>
        </div>
        <div class="tag">
          简&nbsp;&nbsp;介：
          <span>添加简介</span>
        </div>
      </div>
    </div>
    <div class="tab-body">
      <div class="tab-box">
        <div :class="pageActive === 0 ? 'active' : ''" @click="checkPage(0)">
          歌曲列表
        </div>
        <div :class="pageActive === 1 ? 'active' : ''" @click="checkPage(1)">
          评论<span>（0）</span>
        </div>
        <div :class="pageActive === 2 ? 'active' : ''" @click="checkPage(2)">
          收藏者
        </div>
      </div>
      <div class="search-box">
        <div
          :class="searchData.length > 0 ? 'clear' : ''"
          @click="clearInput"
        ></div>
        <!-- @input="searchFn" -->
        <!-- 暂时使用失焦搜索 -->
        <input
          v-model="searchData"
          @blur="searchFn"
          type="text"
          placeholder="搜索歌单音乐"
        />
      </div>
    </div>
    <div class="music-body" v-show="pageActive === 0">
      <div class="sort-body">
        <div class="as-no"></div>
        <div class="as-title" @click="sortList('sortTitle')">
          音乐标题<i :class="'sort' + sortTitle"></i>
        </div>
        <div class="as-singer" @click="sortList('sortSinger')">
          歌手<i :class="'sort' + sortSinger"></i>
        </div>
        <div class="as-album" @click="sortList('sortAlbum')">
          专辑<i :class="'sort' + sortAlbum"></i>
        </div>
        <div class="as-time" @click="sortList('sortTime')">
          时长<i :class="'sort' + sortTime"></i>
        </div>
      </div>
      <div v-if="tracks">
        <div
          v-for="(item, index) in tracks"
          :class="[
            'item-box',
            {
              playing:
                currentMusic &&
                item.id === currentMusic.id &&
                currentMusic.menuId === id &&
                isPlaying,
              'no-playing':
                currentMusic &&
                item.id === currentMusic.id &&
                currentMusic.menuId === id &&
                !isPlaying,
              'playing-item':
                currentMusic &&
                item.id === currentMusic.id &&
                currentMusic.menuId === id,
              'bg-white': activeItem === index,
            },
          ]"
          :key="item.id + '' + index"
          v-show="item.check"
          @dblclick="checkMusic(item)"
          @click="checkItem(index)"
          @contextmenu.prevent="rightClick(item)"
        >
          <div
            class="item-index"
            v-if="
              currentMusic &&
              item.id === currentMusic.id &&
              currentMusic.menuId === id
            "
          ></div>
          <div class="item-index" v-else>{{ index | indexFilter }}</div>
          <div class="item-sc"></div>
          <div class="item-download"></div>
          <div
            :class="[
              'item-name',
              !item.canUse && item.fee !== 1 ? 'gray-word' : '',
            ]"
          >
            <!-- <div class="item-name"> -->
            <div class="name-box">
              <span class="name" v-html="item.name"></span>
              <span class="name-tip" v-if="item.alia.length > 0"
                ><em>({{ item.alia.join("/") }})</em></span
              >
            </div>
            <span class="sq"></span>
            <!-- v-if="item.h.vd <= 0 || item.l.vd <= 0 || item.m.vd <= 0" -->
            <span class="mv" v-if="item.mv"></span>
            <span class="more" @click="rightClick(item)"></span>
          </div>
          <div
            class="singer-name"
            v-html="item.ar.map((el) => el.name).join('/')"
          ></div>
          <div class="item-zj" v-html="item.al.name"></div>
          <div class="item-time">{{ item.dt | durationFilter }}</div>
        </div>
      </div>
      <div v-else class="list-loading">
        <img src="@/assets/images/loading.gif" alt="" />
      </div>
    </div>
    <div v-show="pageActive === 1">评论</div>
    <div v-show="pageActive === 2">收藏</div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import vPinyin from "@/assets/js/vue-py.js";
import { remote } from "electron";
const { Menu, MenuItem } = remote;
const debounce = (() => {
  let timer = 0;
  return (callback, ms = 500) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  name: "ownMenu",
  data() {
    return {
      id: "",
      pageActive: 0, //tab切换
      activeItem: "", //当前活动（未播放）歌曲
      titleShow: false,
      searchData: "",
      sortTitle: 0, //音乐标题排序0：正常，1:从大到小，2：从小到大
      sortSinger: 0, //歌手排序
      sortAlbum: 0, //专辑排序
      sortTime: 0, //时长排序
      imgError: require("@/assets/images/err-img3.png"),
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.page.userInfo;
    },
    currentMusic() {
      return this.$store.state.music.currentMusic;
    },
    menuItem() {
      return this.$store.state.page.playlist.find((el) => el.id === this.id);
    },
    tracks() {
      if (!this.menuItem || !this.menuItem.tracks) return null;
      const newTracks = [...this.menuItem.tracks];
      if (this.sortTitle) {
        if (this.sortTitle === 1) {
          let arr = newTracks.sort((a, b) =>
            a.sortTitle.localeCompare(b.sortTitle)
          );
          return arr;
        } else {
          let arr = newTracks.sort((a, b) =>
            b.sortTitle.localeCompare(a.sortTitle)
          );
          return arr;
        }
      } else if (this.sortSinger) {
        if (this.sortSinger === 1) {
          let arr = newTracks.sort((a, b) =>
            a.ar[0].sortSinger.localeCompare(b.ar[0].sortSinger)
          );
          return arr;
        } else {
          let arr = newTracks.sort((a, b) =>
            b.ar[0].sortSinger.localeCompare(a.ar[0].sortSinger)
          );
          return arr;
        }
      } else if (this.sortAlbum) {
        if (this.sortAlbum === 1) {
          let arr = newTracks.sort((a, b) =>
            a.al.sortAlbum.localeCompare(b.al.sortAlbum)
          );
          return arr;
        } else {
          let arr = newTracks.sort((a, b) =>
            b.al.sortAlbum.localeCompare(a.al.sortAlbum)
          );
          return arr;
        }
      } else if (this.sortTime) {
        if (this.sortTime === 1) {
          let arr = newTracks.sort((a, b) => a.dt - b.dt);
          return arr;
        } else {
          let arr = newTracks.sort((a, b) => b.dt - a.dt);
          return arr;
        }
      }
      return newTracks;
    },
    currentIndex() {
      return this.$store.getters.currentIndex;
    },
    isPlaying() {
      //是否在播放
      return this.$store.state.music.isPlaying;
    },
  },
  methods: {
    ...mapMutations([
      "SET_PLAYLIST",
      "SET_MUSICLIST",
      "SET_SET_PLAYLIST_TRACKS",
    ]),
    ...mapActions(["musicDetail", "getMenuDetail", "canUse", "musicUrl"]),
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
    async checkMusic(item) {
      if (
        this.currentMusic &&
        this.currentMusic.menuId === this.id &&
        item.id === this.currentMusic.id
      )
        return;
      if (item.fee === 1) return this.$emit("vipPopShowFn");
      else if (!item.canUse)
        return this.$toast("因合作方要求，该资源暂时下架>_<");
      const musicList = [];
      this.tracks.forEach((el) => {
        if (el.canUse && el.fee !== 1) {
          el.menuId = this.menuItem.id;
          musicList.push(el);
        }
      });
      // this.activeItem = "";
      this.SET_MUSICLIST({
        musicList,
        currentMusic: { ...item, menuId: this.menuItem.id },
      });
    },
    rightClick(item) {
      const _this = this;
      const arr = [
        {
          label: "播放",
          click: function () {
            _this.checkMusic(item);
          },
        },
        {
          label: "查看评论",
          enabled: false, //false不可点击
          click: function () {
            console.log("查看评论");
          },
        },
        {
          label: "下一首播放",
          click: function () {
            console.log("下一首播放");
          },
        },
        {
          type: "separator", //checkbox,radio
        },
        {
          label: "收藏",
          submenu: [
            {
              label: "创建新歌单",
              click: function () {
                console.log("创建新歌单");
              },
            },
            {
              type: "separator", //checkbox,radio
            },
          ],
        },
        {
          label: "分享...",
          click: function () {
            console.log("分享...");
          },
        },
        {
          label: "复制链接",
          click: function () {
            console.log("复制链接");
          },
        },
        {
          label: "下载",
          click: function () {
            console.log("下载");
          },
        },
        {
          type: "separator",
        },
        {
          label: "重歌单中删除",
          click: function () {
            console.log("从歌单中删除");
          },
        },
      ];
      // 右键菜单
      const list = this.$store.state.page.playlist;
      const mm = list.map((el) => ({
        el,
        label: el.name,
        click: function () {
          console.log(el.name);
        },
      }));
      arr[4].submenu = [...arr[4].submenu, ...mm];
      const menu = new Menu();
      arr.forEach((el) => {
        menu.append(new MenuItem(el));
      });
      // 展示出来
      menu.popup(remote.getCurrentWindow());
    },
    checkItem(index) {
      this.activeItem = index;
    },
    listScroll() {
      const scrollTop = document.querySelector(".main-body").scrollTop;
      if (scrollTop > 300) {
        this.titleShow = true;
      } else {
        this.titleShow = false;
      }
    },
    checkPage(index) {
      this.pageActive = index;
    },
    clearInput() {
      this.searchData = "";
    },
    timeSortFn(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j].al.id <= arr[j + 1].al.id) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
      return arr;
    },
    sortList(type) {
      const arr = ["sortTitle", "sortSinger", "sortAlbum", "sortTime"];
      arr.forEach((el) => {
        if (type === el) {
          if (this[el] < 2) this[el]++;
          else this[el] = 0;
        } else {
          this[el] = 0;
        }
      });
    },
    searchFn() {
      const replaceReg = new RegExp(this.searchData, "g");
      this.tracks.forEach((el) => {
        if (
          el.name.includes(this.searchData) &&
          !el.name.includes('<span class="blue-word">')
        ) {
          el.name = el.name.replace(
            replaceReg,
            `<span class="blue-word">${this.searchData}</span>`
          );
        } else {
          el.name = el.name
            .replace(/<span class="blue-word">/g, ``)
            .replace(/<\/span>/g, "");
        }
        if (
          el.ar[0].name.includes(this.searchData) &&
          !el.ar[0].name.includes('<span class="blue-word">')
        ) {
          el.ar[0].name = el.ar[0].name.replace(
            replaceReg,
            `<span class="blue-word">${this.searchData}</span>`
          );
        } else {
          el.ar[0].name = el.ar[0].name
            .replace(/<span class="blue-word">/g, ``)
            .replace(/<\/span>/g, "");
        }
        if (
          el.al.name.includes(this.searchData) &&
          !el.al.name.includes('<span class="blue-word">')
        ) {
          el.al.name = el.al.name.replace(
            replaceReg,
            `<span class="blue-word">${this.searchData}</span>`
          );
        } else {
          el.al.name = el.al.name
            .replace(/<span class="blue-word">/g, ``)
            .replace(/<\/span>/g, "");
        }
        if (
          el.name.includes(this.searchData) ||
          el.ar[0].name.includes(this.searchData) ||
          el.al.name.includes(this.searchData)
        ) {
          el.check = true;
        } else {
          el.check = false;
        }
      });
    },
    async renderPage() {
      this.pageActive = 0;
      this.activeItem = "";
      this.id = Number(this.$route.name.replace("ownMenu", ""));
      try {
        if (!this.tracks) {
          //无缓存数据，重新获取
          const playlist = await this.getMenuDetail(this.id);
          // const idArr = playlist.trackIds.map(el=>el.id)
          // const urls = await this.musicUrl(idArr)
          // console.log("urls",urls);
          const arr = playlist.tracks.map((el) => {
            return new Promise((resolve) => {
              this.canUse(el.id).then((res) => {
                el.canUse = res;
                el.check = true;
                el.sortTitle = vPinyin.chineseToPinYin(el.name);
                el.ar[0].sortSinger = vPinyin.chineseToPinYin(el.ar[0].name);
                el.al.sortAlbum = vPinyin.chineseToPinYin(el.al.name);
                el.url = `https://music.163.com/song/media/outer/url?id=${el.id}.mp3`;
                if (!res) console.log("不可用音乐", el.name);
                resolve();
              });
            });
          });
          await Promise.all(arr);
          this.SET_PLAYLIST(playlist);
          console.log("playlist", playlist);
        } else {
          //todo 有缓存数据先展示缓存，后台刷新列表？
          // this.getMenuDetail(_this.id);
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  },
  filters: {
    indexFilter: (val) => {
      val = val + 1;
      if (val < 10) return "0" + val;
      else return val;
    },
    timeFilter(timestamp) {
      function addZero(num) {
        return num < 10 ? "0" + num : num;
      }
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = addZero(date.getMonth() + 1);
      let day = addZero(date.getDate());
      return year + "-" + month + "-" + day;
    },
    durationFilter(a) {
      a = a / 1000;
      let b = "";
      let h = parseInt(a / 36000),
        m = parseInt((a % 3600) / 60),
        s = parseInt((a % 3600) % 60);
      if (h > 0) {
        h = h < 10 ? "0" + h : h;
        b += h + ":";
      }
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      b += m + ":" + s;
      return b;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async (_this) => {
      if (from.name) {
        const mainBody = document.querySelector(".main-body");
        mainBody.scrollTop = 0;
        mainBody.addEventListener("scroll", () => debounce(_this.listScroll()));
      }
      _this.renderPage();
    });
  },
  beforeRouteLeave(to, from, next) {
    const mainBody = document.querySelector(".main-body");
    mainBody.removeEventListener("scroll", () => this.listScroll());
    next();
  },
};
</script>
<style lang="scss">
.blue-word {
  color: rgb(142, 181, 222);
}
</style>
<style lang="scss" scoped>
.own-menu {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
    opacity: 0;
  }
  .hover-btn:hover {
    filter: brightness(1.2);
    background: rgb(48, 48, 48);
  }
  .own-title {
    background: rgb(37, 37, 37);
    position: fixed;
    top: 51px;
    height: 80px;
    width: calc(100% - 196px);
    color: #b3b3b3;
    font-size: 22px;
    .title-name {
      margin: 10px 30px;
    }
    .title-btn {
      margin: 0px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 170px;
      .play-all {
        background: url(~@/assets/images/play-all.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 20px;
      }
      .share {
        background: url(~@/assets/images/share-title.png) no-repeat;
        background-size: 100% 100%;
        width: 17px;
        height: 17px;
      }
      .download {
        background: url(~@/assets/images/xz.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 16px;
      }
      .title-sc {
        background: url(~@/assets/images/sc-title.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 20px;
      }
    }
  }
  .own-top {
    display: flex;
    padding: 15px 37px 25px 25px;
    .own-pic {
      display: block;
      width: 200px;
      height: 200px;
      border-radius: 6px;
    }
    .info-box {
      padding-left: 30px;
      .own-name {
        color: rgb(179, 179, 179);
        font-size: 22px;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        font-family: PingFangSC-Medium;
        span {
          display: block;
          border: 1px solid rgb(176, 66, 55);
          font-size: 12px;
          line-height: 18px;
          color: rgb(176, 66, 55);
          padding: 0px 5.5px;
          border-radius: 3px;
          margin-right: 8px;
        }
      }
      .user-name {
        display: flex;
        align-items: center;
        font-size: 12px;
        img {
          width: 23px;
          height: 23px;
          border-radius: 50%;
        }
        .name {
          color: rgb(130, 165, 202);
          margin-left: 7px;
        }
        .time {
          color: rgb(129, 129, 129);
          margin-left: 11px;
        }
      }
      .tag {
        display: flex;
        font-size: 12px;
        color: rgb(175, 175, 175);
        margin-bottom: 5px;
        span {
          color: rgb(140, 179, 219);
          &:hover {
            color: rgb(179, 199, 220);
          }
        }
      }
      .btn-box {
        display: flex;
        font-size: 12px;
        color: rgb(175, 175, 175);
        margin: 22px 0 17px 0;
        .btn-play {
          width: 140px;
          height: 30px;
          border-radius: 15px;
          background: rgb(205, 77, 64);
          display: flex;
          align-items: center;
        }
        .btn-left {
          color: #fff;
          font-size: 14px;
          padding-right: 12px;
          height: 30px;
          border-right: 1px solid rgb(209, 93, 81);
          display: flex;
          align-items: center;
          i {
            display: inline-block;
            background: url(~@/assets/images/play-white.png) no-repeat;
            background-size: 100% 100%;
            width: 18px;
            height: 18px;
            vertical-align: -4px;
            margin: 0 4px 0 16px;
          }
        }
        .btn-right {
          flex: 1;
          background: url(~@/assets/images/add-title.png) no-repeat 8px center;
          background-size: 13px 13px;
          height: 30px;
        }
        .btn-sc {
          height: 30px;
          box-sizing: border-box;
          width: 90px;
          display: flex;
          align-items: center;
          border: 1px solid rgb(69, 69, 69);
          border-radius: 15px;
          justify-content: center;
          margin-left: 8px;
          font-size: 13px;
          i {
            display: block;
            background: url(~@/assets/images/sc-title.png) no-repeat;
            background-size: 100% 100%;
            width: 17px;
            height: 16px;
            margin-right: 4px;
          }
        }
        .btn-share {
          height: 30px;
          box-sizing: border-box;
          width: 90px;
          display: flex;
          align-items: center;
          border: 1px solid rgb(69, 69, 69);
          border-radius: 15px;
          justify-content: center;
          margin-left: 8px;
          font-size: 13px;
          i {
            display: block;
            background: url(~@/assets/images/share-title.png) no-repeat;
            background-size: 100% 100%;
            width: 16px;
            height: 14px;
            margin-right: 4px;
          }
        }
        .btn-down {
          height: 30px;
          box-sizing: border-box;
          width: 101px;
          display: flex;
          align-items: center;
          border: 1px solid rgb(69, 69, 69);
          border-radius: 15px;
          justify-content: center;
          margin-left: 8px;
          font-size: 13px;
          i {
            display: block;
            background: url(~@/assets/images/xz.png) no-repeat;
            background-size: 100% 100%;
            width: 18px;
            height: 15px;
            margin-right: 4px;
          }
        }
      }
      .info-content {
        display: flex;
        font-size: 12px;
        color: rgb(175, 175, 175);
        margin-bottom: 5px;
        span {
          color: rgb(135, 135, 135);
          margin-right: 13px;
        }
      }
    }
  }
  .tab-body {
    display: flex;
    margin: 0 50px 0 30px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(48, 48, 48);
    .tab-box {
      display: flex;
      font-size: 14px;
      color: rgb(179, 179, 179);
      line-height: 30px;
      width: 212px;
      height: 33px;
      justify-content: space-between;
      div {
        span {
          display: inline-block;
          font-size: 12px;
          color: rgb(120, 120, 120);
        }
      }
      div:not(.active):hover {
        color: #fff;
      }
      .active {
        color: rgb(169, 51, 45);
        border-bottom: 2px solid rgb(169, 51, 45);
        span {
          color: rgb(169, 51, 45);
        }
      }
    }
    .search-box {
      width: 120px;
      font-size: 12px;
      display: flex;
      align-items: center;
      height: 20px;
      input {
        display: block;
        outline: none;
        background: none;
        border: none;
        color: rgb(169, 169, 169);
        text-indent: 4px;
        width: 90px;
        &::-webkit-input-placeholder {
          color: rgb(73, 73, 73);
        }
      }
      div {
        display: block;
        background: url(~@/assets/images/search-icon.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
        height: 20px;
      }
      .clear {
        background: url(~@/assets/images/search-delete.png) center center
          no-repeat;
        background-size: 8px 8px;
      }
    }
  }
  .music-body {
    .sort-body {
      display: flex;
      font-size: 12px;
      color: rgb(135, 135, 135);
      line-height: 35px;
      padding: 0 0 0 25px;
      & > div:not(.as-no) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover {
          background: rgb(50, 50, 50);
          i {
            display: block;
            margin-right: 13px;
          }
          .sort0 {
            background: url(~@/assets/images/sort-a.png) no-repeat;
            background-size: 100% 100%;
            width: 6px;
            height: 10px;
          }
          .sort1 {
            background: url(~@/assets/images/sort-b.png) no-repeat;
            background-size: 100% 100%;
            width: 10px;
            height: 6px;
          }
          .sort2 {
            background: url(~@/assets/images/sort-c.png) no-repeat;
            background-size: 100% 100%;
            width: 10px;
            height: 6px;
          }
        }
      }
      .as-no {
        width: 85px;
      }
      .as-title {
        width: 28%;
        text-indent: 5px;
      }
      .as-singer {
        flex: 1;
        padding-left: 5px;
      }
      .as-album {
        flex: 1;
        padding-left: 5px;
      }
      .as-time {
        width: 87px;
        padding-left: 5px;
      }
    }
    .item-box {
      display: flex;
      align-items: center;
      padding: 0 0 0 25px;
      font-size: 12px;
      background: rgb(41, 41, 41);
      height: 34px;
      &:nth-child(2n) {
        background: rgb(37, 37, 37);
      }
      &:hover {
        background: rgb(50, 50, 50);
        .more {
          background: url(~@/assets/images/more.png) center center no-repeat;
          background-size: 16px 4px;
        }
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
        height: 12px;
        margin: 0 8px;
      }
      .item-download {
        background: url(~@/assets/images/xz.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 13px;
        margin: 0 12px 0 0px;
      }
      .item-name {
        color: rgb(179, 179, 179);
        width: 28%;
        margin-left: 4px;
        display: flex;
        align-items: center;
        .name-box {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .name {
          display: inline-block;
        }
        .name-tip {
          display: inline-block;
          color: #b9b9b9;
          margin-left: 4px;
          em {
            color: rgb(90, 90, 90);
          }
        }
      }
      .sq {
        display: inline-block;
        background: url(~@/assets/images/sq-1.png) no-repeat;
        background-size: 100% 100%;
        width: 15px;
        height: 12px;
        min-width: 17px;
        margin: 0 2px;
      }
      .mv {
        display: inline-block;
        background: url(~@/assets/images/video-red.png) no-repeat;
        background-size: 100% 100%;
        width: 16px;
        height: 13px;
        min-width: 16px;
        margin: 0 2px;
      }
      .more {
        display: inline-block;
        width: 16px;
        height: 35px;
        min-width: 16px;
        margin: 0 4px 0 2px;
      }
      .gray-word {
        color: rgb(90, 90, 90);
      }
      .singer-name {
        color: rgb(131, 131, 131);
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .item-zj {
        color: rgb(131, 131, 131);
        flex: 1;
      }
      .item-time {
        color: rgb(89, 89, 89);
        width: 87px;
      }
    }
    .playing-item {
      background: rgb(50, 50, 50) !important;
      .item-name {
        color: rgb(187, 69, 57);
      }
      &.playing {
        .item-index {
          display: inline-block;
          background: url(~@/assets/images/laba.png) left center no-repeat;
          background-size: 12px 12px;
          width: 30px;
          height: 34px;
        }
      }
      &.no-playing {
        .item-index {
          display: inline-block;
          background: url(~@/assets/images/laba1.png) left center no-repeat;
          background-size: 12px 12px;
          width: 30px;
          height: 34px;
        }
      }
    }
    .bg-white {
      background: rgb(50, 50, 50) !important;
    }
    .list-loading {
      img {
        display: block;
        width: 20px;
        height: 20px;
        margin: 40px auto;
      }
    }
  }
}
</style>