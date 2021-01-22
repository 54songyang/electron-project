<template>
  <div class="main-page">
    <mySwiper
      v-if="bannerList.length > 0"
      :list="bannerList"
      :autoPlay="true"
      class="swiper-box"
    ></mySwiper>
    <div class="main-list">
      <mainList :myArray="myArray">
        <template #songSheet>
          <div class="recommend-title">
            <span class="hover-bright" @click="$router.push('songSheet')"
              >推荐歌单</span
            >
          </div>
          <div class="main-item">
            <div class="list-item recommend-item">
              <div class="recommend-box">
                <img class="calendar-bg" src="@/assets/images/cal-bg.png" alt />
                <div class="calendar-box">
                  <img
                    class="calendar"
                    src="@/assets/images/calendar-bg.png"
                    alt
                  />
                  <div class="calendar-num">{{ new Date().getDate() }}</div>
                </div>
                <i class="recommend-btn"></i>
              </div>
              <div class="recommend-name hover-bright">
                <div v-clampy="2" class="menu-name hover-bright">
                  每日歌曲推荐
                </div>
              </div>
            </div>
            <div
              class="list-item recommend-item"
              v-for="item in personalized"
              :key="item.id"
            >
              <div class="recommend-box">
                <div class="recommend-num">
                  {{ item.playCount | numberFormat }}
                </div>
                <img v-lazy="imgLazy(item.picUrl, 2)" />
                <i class="recommend-btn"></i>
              </div>
              <div class="recommend-name hover-bright">
                <div v-clampy="2" class="menu-name hover-bright">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #recommend>
          <div class="recommend-title">
            <span class="hover-bright" @click="$router.push('recommend')"
              >独家放送</span
            >
          </div>
          <div class="main-item">
            <div
              class="list-item privatecontent-item"
              v-for="item in privatecontent"
              :key="item.id"
            >
              <div class="recommend-box">
                <img v-lazy="imgLazy(item.sPicUrl, 1)" />
                <i class="privatecontent-btn"></i>
              </div>
              <div class="recommend-name hover-bright">
                <div v-clampy="2" class="menu-name hover-bright">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #newsong>
          <div class="recommend-title">
            <span class="hover-bright" @click="$router.push('newsong')"
              >最新音乐</span
            >
          </div>
          <div class="newsong-flex-box">
            <div class="main-item main-newsong-item">
              <div
                class="list-item newsong-item"
                v-for="(item, index) in newsong.slice(0, 5)"
                :key="item.id"
              >
                <div class="newsong-box">
                  <div class="img-box">
                    <img v-lazy="imgLazy(item.picUrl, 0)" />
                    <i class="privatecontent-btn newsong-btn"></i>
                  </div>
                  <div class="newsong-index">
                    {{ `${index > 8 ? "" : "0"}${index + 1}` }}
                  </div>
                  <div class="newsong-detail" :title="item.name">
                    <div class="newsong-name" v-clampy="1" :title="item.name">
                      {{ item.name }}
                      <span v-if="item.song.alias[0]"
                        >({{ item.song.alias[0] }}</span
                      >
                    </div>
                    <div class="singer-body">
                      <em class="sq-icon"></em>
                      <div
                        class="singer-box"
                        v-html="testff(item.song.artists)"
                      ></div>
                    </div>
                  </div>
                  <div class="newsong-play-btn"></div>
                </div>
              </div>
            </div>
            <div class="main-item main-newsong-item">
              <div
                class="list-item newsong-item"
                v-for="(item, index) in newsong.slice(5)"
                :key="item.id"
              >
                <div class="newsong-box">
                  <div class="img-box">
                    <img :src="item.picUrl" />
                    <i class="privatecontent-btn newsong-btn"></i>
                  </div>
                  <div class="newsong-index">
                    {{ `${index > 3 ? "" : "0"}${index + 6}` }}
                  </div>
                  <div class="newsong-detail" :title="item.name">
                    <div class="newsong-name" v-clampy="1" :title="item.name">
                      {{ item.name }}
                      <span v-if="item.song.alias[0]"
                        >({{ item.song.alias[0] }}</span
                      >
                    </div>
                    <div class="singer-body">
                      <em class="sq-icon"></em>
                      <div
                        class="singer-box"
                        v-html="testff(item.song.artists)"
                      ></div>
                    </div>
                  </div>
                  <div class="newsong-play-btn"></div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #personalizedMv>
          <div class="recommend-title">
            <span class="hover-bright" @click="$router.push('personalizedMv')"
              >推荐MV</span
            >
          </div>
          <div class="main-item">
            <div
              class="list-item privatecontent-item"
              v-for="item in mvData"
              :key="item.id"
            >
              <div class="recommend-box">
                <div v-clampy="3" class="copywriter">{{ item.copywriter }}</div>
                <div class="recommend-num mv-num">
                  {{ item.playCount | numberFormat }}
                </div>
                <img v-lazy="imgLazy(item.picUrl, 1)" lazy="error" />
              </div>
              <div class="recommend-name">
                <div v-clampy="1" class="menu-name hover-bright">
                  {{ item.name }}
                </div>
                <div
                  v-clampy="1"
                  class="singer-box"
                  v-html="testff(item.artists)"
                ></div>
              </div>
            </div>
          </div>
        </template>

        <template #djprogram>
          <div class="recommend-title">
            <span class="hover-bright" @click="$router.push('djprogram')"
              >主播电台</span
            >
          </div>
          <div class="main-item">
            <div
              class="list-item djprogram-item"
              v-for="item in djprogram"
              :key="item.id"
            >
              <div class="djprogram-box">
                <div class="img-box">
                  <img v-lazy="imgLazy(item.picUrl, 0)" />
                </div>
                <div class="djprogram-detail">
                  <div class="djprogram-name hover-bright" v-clampy="1">
                    {{ item.name }}
                  </div>
                  <div class="hover-bright" v-clampy="1">
                    {{ item.copywriter }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </mainList>
    </div>

    <div class="change-index">
      <p>现在可以根据个人喜好,自由调整首页栏目顺序啦～</p>
      <div class="change-btn" @click="changIndex">调整栏目顺序</div>
    </div>
    <div class="shelter" v-show="changeShow"></div>
    <div class="change-box" ref="changeBox" v-show="changeShow">
      <div class="change-title" @mousedown="dragPop">
        <i @click="changeShow = false"></i>调整栏目顺序
      </div>
      <div class="change-tip">想调整首页栏目的顺序？按住右边的按钮拖动即可</div>
      <div class="change-list-box">
        <draggable v-model="changeArr">
          <transition-group>
            <div
              class="change-item-box"
              v-for="item in changeArr"
              :key="item.id"
            >
              <div class="change-item">{{ item.name }}</div>
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="change-detai" @click="defaultList">恢复默认排序</div>
      <div class="change-cli" @click="changeList">确定</div>
    </div>
  </div>
</template>

<script>
import mySwiper from "@/components/my-swiper";
import draggable from "vuedraggable";
import mainList from "./mainList";
import { mapState } from "vuex";
export default {
  name: "mainPage",
  components: {
    mySwiper,
    draggable,
    mainList,
  },
  data() {
    return {
      imgShow: true,
      bannerList: [],
      changeShow: false,
      myArray: [
        { name: "推荐歌单", id: "songSheet", index: 0 },
        { name: "独家放送", id: "recommend", index: 1 },
        { name: "最新音乐", id: "newsong", index: 2 },
        { name: "推荐MV", id: "personalizedMv", index: 3 },
        { name: "主播电台", id: "djprogram", index: 4 },
      ],
      changeArr: [
        { name: "推荐歌单", id: "songSheet", index: 0 },
        { name: "独家放送", id: "recommend", index: 1 },
        { name: "最新音乐", id: "newsong", index: 2 },
        { name: "推荐MV", id: "personalizedMv", index: 3 },
        { name: "主播电台", id: "djprogram", index: 4 },
      ],
    };
  },
  computed: {
    personalized() {
      return this.$store.state.page.personalized;
    },
    privatecontent() {
      return this.$store.state.page.privatecontent;
    },
    mvData() {
      return this.$store.state.page.mvData;
    },
    newsong() {
      return this.$store.state.page.newsong;
    },
    djprogram() {
      return this.$store.state.page.djprogram;
    },
  },
  mounted() {
    this.$axios({
      type: "get",
      url: `banner?type=0`,
    })
      .then((res) => {
        console.log("banners", res.banners);
        if (res.code === 200) this.bannerList = res.banners;
      })
      .catch((err) => {
        console.log("err", err);
      });
  },
  methods: {
    testff(val) {
      return val
        .map((el, i) => {
          if (i === val.length - 1)
            return `<span class='hover-bright singer'>${el.name}</span>`;
          return `<span class='hover-bright singer'>${el.name}</span><span class='fenge'>/</span>`;
        })
        .join("");
    },
    imgLazy(img, type) {
      let error = "";
      let src = img;
      switch (type) {
        case 0:
          error = require("@/assets/images/err-img1.png");
          break;
        case 1:
          error = require("@/assets/images/err-img.png");
          break;
        case 2:
          error = require("@/assets/images/err-img2.png");
          break;
      }
      return {
        src,
        error,
      };
    },
    changIndex() {
      const changeBox = this.$refs.changeBox;
      changeBox.style.top = (document.body.clientHeight - 395) / 2 + "px";
      changeBox.style.left = (document.body.clientWidth - 330) / 2 + "px";
      this.changeShow = true;
    },
    dragPop(e) {
      document.onmousemove = (e) => {
        if (!document.querySelector(".change-box").contains(e.target))
          return (document.onmousemove = null), (document.onmouseup = null);
        var oDiv = e.path[1];
        var disX = e.clientX - oDiv.offsetLeft;
        var disY = e.clientY - oDiv.offsetTop;
        const dw = document.body.clientWidth - 330;
        const dh = document.body.clientHeight - 395;
        document.onmousemove = (e) => {
          e.preventDefault();
          var l = e.clientX - disX > 0 ? e.clientX - disX : 0;
          var t = e.clientY - disY > 0 ? e.clientY - disY : 0;
          oDiv.style.left = `${l < dw ? l : dw}px`;
          oDiv.style.top = `${t < dh ? t : dh}px`;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    },
    changeList() {
      this.myArray = this.changeArr;
      this.changeShow = false;
    },
    defaultList() {
      this.changeArr = [
        { name: "推荐歌单", id: "songSheet", index: 0 },
        { name: "独家放送", id: "recommend", index: 1 },
        { name: "最新音乐", id: "newsong", index: 2 },
        { name: "推荐MV", id: "personalizedMv", index: 3 },
        { name: "主播电台", id: "djprogram", index: 4 },
      ];
    },
  },
  filters: {
    numberFormat(val) {
      var k = 10000,
        sizes = ["", "万", "亿", "万亿"],
        i;
      if (val < k) {
        return val;
      } else {
        i = Math.floor(Math.log(val) / Math.log(k));
        return (val / Math.pow(k, i)).toFixed(0) + sizes[i];
      }
    },
  },
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
  .newsong-flex-box {
    display: flex;
    margin-bottom: 30px;
  }
  .main-list {
    margin: 20px 10px 0 10px;
    .recommend-title {
      display: flex;
      align-items: center;
      color: rgb(179, 179, 179);
      font-size: 16px;
      line-height: 40px;
      padding-right: 30px;
      margin-bottom: 3px;
      font-weight: normal;
      & span::after {
        content: "";
        display: inline-block;
        background: url(~@/assets/images/next.png) no-repeat;
        background-size: 100% 100%;
        width: 18px;
        height: 18px;
        filter: brightness(2.3);
        vertical-align: -3px;
      }
    }
    .main-item {
      display: flex;
      flex-wrap: wrap;
      .list-item {
        margin: 0 20px 40px 0;
        .newsong-box {
          display: flex;
          align-items: center;
          position: relative;
          .img-box {
            position: relative;
            img {
              display: block;
              width: 60px;
              height: 60px;
              border-radius: 4px;
            }
            .newsong-btn {
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              position: absolute;
              background-image: url(~@/assets/images/recommend-play.png);
              background-color: rgba(209, 209, 209, 0.7);
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 45% 45%;
              border-radius: 50%;
              width: 20px;
              height: 20px;
            }
          }
          .newsong-index {
            font-size: 13px;
            line-height: 60px;
            margin: 0 10px;
          }
          .newsong-detail {
            font-size: 14px;
            color: rgb(179, 179, 179);
            line-height: 20px;
            span {
              display: inline-block;
              margin-left: 8px;
              line-height: 20px;
              color: rgb(102, 102, 102);
            }
            .newsong-name {
              cursor: default;
              margin-bottom: 6px;
            }
          }
          .newsong-play-btn {
            position: absolute;
            right: 30px;
            width: 50px;
            background: url(~@/assets/images/video-red.png) no-repeat;
            background-size: 100% 100%;
            width: 16px;
            height: 14px;
          }
          .singer-body {
            display: flex;
            cursor: pointer;
            align-items: center;
          }
          .sq-icon {
            display: block;
            width: 15px;
            height: 12px;
            background: url(~@/assets/images/sq.png) no-repeat;
            background-size: 100% 100%;
            pointer-events: none;
            margin-right: 4px;
          }
        }
        .djprogram-box {
          display: flex;
          align-items: center;
          border-radius: 4px;
          overflow: hidden;
          img {
            display: block;
            width: 95px;
            height: 95px;
            margin-right: 20px;
          }
          .djprogram-detail {
            font-size: 13px;
            color: rgb(89, 89, 89);
            .djprogram-name {
              font-size: 14px;
              color: rgb(179, 179, 179);
              margin-bottom: 5px;
            }
          }
        }
        .recommend-box {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          min-height: 97.78px;
          .copywriter {
            position: absolute;
            top: -48px;
            left: 0;
            width: 100%;
            font-size: 12px;
            color: #fff;
            text-shadow: 0.5px 0.5px 0.5px #6d6d6d;
            background: rgba(0, 0, 0, 0.5);
            padding: 6px;
          }
          &:hover .recommend-btn {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background-image: url(~@/assets/images/recommend-play.png);
            background-color: rgba(209, 209, 209, 0.7);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 45% 45%;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: fadeIn linear 0.2s;
          }
          &:hover .mv-num {
            animation: fadeOut linear 0.2s;
            opacity: 0;
          }
          &:hover .copywriter {
            animation: copywriterIn linear 0.2s;
            top: 0;
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 6px;
          }
          .recommend-num {
            position: absolute;
            display: flex;
            align-items: center;
            padding-left: 20px;
            text-shadow: 0.5px 0.5px 0.5px #6d6d6d;
            top: 3px;
            right: 8px;
            color: #fff;
            font-size: 13px;
            font-weight: 500;
            &::before {
              content: "";
              display: block;
              background: url(~@/assets/images/recommend-play1.png) no-repeat;
              background-size: 100% 100%;
              width: 14px;
              height: 14px;
              margin-right: 2px;
            }
          }
          .calendar-bg {
            display: block;
            border-radius: 6px;
            filter: blur(3px);
            width: 100%;
            height: 100%;
          }
          .calendar-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .calendar {
              display: block;
              width: 100px;
              height: 110px;
            }
            .calendar-num {
              position: absolute;
              top: 42px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 40px;
              font-weight: 400;
              color: #fff;
            }
          }
          .privatecontent-btn {
            position: absolute;
            top: 8px;
            left: 8px;
            background-image: url(~@/assets/images/recommend-play1.png);
            background-color: rgba(0, 0, 0, 0.5);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 70% 70%;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            border: 1px solid #fff;
            box-sizing: border-box;
          }
        }
        .recommend-name {
          margin-top: 4px;
          font-size: 13px;
          color: rgb(178, 178, 178);
          line-height: 20px;
        }
      }
      .djprogram-item {
        width: calc((100% - 20px) / 2);
        padding: 10px 0 10px 10px;
        border-radius: 4px;
        margin-bottom: 0px;
        &:nth-child(2n) {
          margin-right: 0;
        }
        &:hover {
          background: rgb(46, 46, 46);
        }
      }
      .singer-box {
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #aeaeae;
        font-size: 12px;
      }
      .recommend-item {
        width: calc((100% - 80px) / 5);
        &:nth-child(5n) {
          margin-right: 0;
        }
      }
      .privatecontent-item {
        width: calc((100% - 60px) / 4);
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
      .newsong-item {
        padding: 10px 0 10px 10px;
        border-radius: 4px;
        margin-bottom: 0px;
        &:hover {
          background: rgb(46, 46, 46);
        }
      }
    }
    .main-newsong-item {
      width: calc((100% - 20px) / 2);
      flex-direction: column;
    }
  }
  .change-index {
    text-align: center;
    font-size: 12px;
    color: rgb(102, 102, 102);
    margin: 70px 0;
    .change-btn {
      border-radius: 15px;
      height: 30px;
      font-size: 13px;
      line-height: 29px;
      color: rgb(193, 70, 58);
      border: 1px solid rgb(193, 70, 58);
      margin: 0 auto;
      width: 18%;
      margin-top: 10px;
    }
  }
  .change-box {
    position: fixed;
    background: rgb(54, 54, 54);
    height: 395px;
    width: 330px;
    top: 20px;
    left: 100px;
    z-index: 10000;
    border-radius: 6px;
    .change-title {
      position: relative;
      font-weight: 500;
      font-size: 16px;
      color: rgb(185, 185, 185);
      text-align: center;
      line-height: 50px;
      cursor: move;
      i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 10px;
        background: url(~@/assets/images/close.png) no-repeat;
        background-size: 100% 100%;
        width: 22px;
        height: 22px;
      }
    }
    .change-tip {
      font-size: 12px;
      color: rgb(94, 94, 94);
      line-height: 50px;
      text-align: center;
    }
    .change-list-box {
      .change-item-box {
        padding: 0 15px;
        .change-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: rgb(185, 185, 185);
          font-size: 14px;
          line-height: 35px;
          border-bottom: 1px solid rgb(69, 69, 69);
          box-sizing: border-box;
          opacity: 1;
          &::after {
            content: "";
            display: block;
            background: url(~@/assets/images/change-icon.png) no-repeat;
            background-size: 100% 100%;
            width: 30px;
            height: 20px;
          }
        }
        &:hover {
          background: rgb(62, 62, 62);
        }
        &:active {
          background: rgb(41, 41, 41);
          .change-item {
            border-color: rgb(41, 41, 41);
          }
        }
      }
    }
    .change-detai {
      font-size: 14px;
      line-height: 60px;
      text-align: center;
      color: rgb(141, 141, 141);
      text-decoration: underline;
    }
    .change-cli {
      font-size: 14px;
      letter-spacing: 3px;
      height: 30px;
      border-radius: 15px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      background: linear-gradient(to right, rgb(233, 94, 78), rgb(195, 70, 58));
      width: 85px;
      margin: 0 auto;
    }
  }
  .shelter {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    cursor: default;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes copywriterIn {
    0% {
      top: -48px;
    }
    100% {
      top: 0;
    }
  }
}
</style>
<style lang="scss">
.main-page {
  .singer {
    display: block;
    font-size: 13px;
    color: rgb(102, 102, 102);
  }
  .fenge {
    display: block;
    margin: 0 2px;
    font-size: 14px;
  }
}
img[lazy="error"] {
}
</style>