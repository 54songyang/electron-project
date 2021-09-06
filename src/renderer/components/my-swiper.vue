<template>
  <div
    class="slider-container"
    ref="slider"
    @mouseover="pause()"
    @mouseout="play()"
  >
    <div class="slider-content" :class="mask ? 'mask' : ''">
      <div
        class="slider"
        v-for="(item, index) in list"
        :key="index"
        :class="setClass(index)"
        @click="onClick(index)"
      >
        <!-- :style="{backgroundImage: 'url(' + item.imageUrl + ')' }" -->
        <img :src="item.imageUrl" alt />
        <div
          class="banner-tag"
          :style="`background: ${backgroundFn(item.titleColor)}`"
        >
          {{ item.typeTitle }}
        </div>
      </div>
      <i v-show="arrow" class="iconfont icon-left" @click="prev()"></i>
      <i v-show="arrow" class="iconfont icon-right" @click="next()"></i>
    </div>
    <div class="dots" v-if="dots">
      <span
        v-for="(item, index) in list"
        :key="index"
        :style="setActiveDot(index)"
        @mouseover="currentIndex = index"
      ></span>
    </div>
    <i class="left-btn"></i>
    <i class="right-btn"></i>
  </div>
</template>

<script>
// import "../assets/icon.css";
export default {
  data() {
    return {
      currentIndex: 0,
      sliderDomList: [],
      timer: null,
    };
  },
  props: {
    list: {
      // required: true,
      type: Array,
      default() {
        return [];
      },
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 4000,
    },
    dots: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "#e03938",
    },
  },
  mounted() {
    this.sliderDomList = this.$refs.slider.querySelectorAll("div.slider");
    this.play();
  },
  methods: {
    setClass(i) {
      let next =
        this.currentIndex === this.list.length - 1 ? 0 : this.currentIndex + 1;
      let prev =
        this.currentIndex === 0 ? this.list.length - 1 : this.currentIndex - 1;
      switch (i) {
        case this.currentIndex:
          return "active";
        case next:
          return "next";
        case prev:
          return "prev";
        default:
          return "";
      }
    },
    setActiveDot(index) {
      return index === this.currentIndex
        ? {
            backgroundColor: this.color,
          }
        : {
            backgroundColor: "#3a3a3a",
          };
    },
    play() {
      this.pause();
      if (this.autoPlay) {
        this.timer = setInterval(() => {
          this.next();
        }, this.interval);
      }
    },
    pause() {
      clearInterval(this.timer);
    },
    next() {
      this.currentIndex = ++this.currentIndex % this.list.length;
    },
    prev() {
      this.currentIndex =
        this.currentIndex === 0 ? this.list.length - 1 : this.currentIndex - 1;
    },
    backgroundFn(e) {
      switch (e) {
        case "red":
          return `rgb(198, 83, 89)`;
        case "blue":
          return `rgb(84, 121, 198)`;
        default:
          return `rgb(198, 83, 89)`;
      }
    },
    onClick(i) {
      if (i === this.currentIndex) {
        this.$emit("sliderClick", i);
      } else {
        let currentClickClassName =
          this.sliderDomList[i].className.split(" ")[1];
        console.log(currentClickClassName);
        if (currentClickClassName === "next") {
          this.next();
        } else {
          this.prev();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.slider-container {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 10px 0;
  position: relative;

  .slider-content {
    position: relative;
    width: 100%;
    height: calc(100% - 5px);
    left: 0%;
    top: 0%;
    margin: 0px;
    padding: 0px;
    background-size: inherit;
    .slider {
      position: absolute;
      margin: 0;
      padding: 0;
      top: 0;
      left: 50%;
      width: 70%;
      height: 100%;
      border-radius: 8px;
      transition: 500ms all ease-in-out;
      background-color: #fff;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      transform: translate3d(-50%, 0, -80px);
      opacity: 0;
      z-index: 1;
      img {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        background-color: rgb(30, 30, 30);
        -webkit-user-drag: none;
        cursor: pointer;

        &::after {
          content: url(~@/assets/images/sing.png);
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          background-size: 100% 100%;
          border-radius: 8px;
        }
      }
      &:before {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0);
        transition-delay: 100ms !important;
        transition: all 500ms;
        // cursor: pointer;
      }

      &.active {
        opacity: 1;
        transform: translate3d(-50%, 0, 0);
        z-index: 20;
      }

      &.prev {
        opacity: 0.6;
        transform: scale(0.85) translate3d(-90%, 0, 100px);
        z-index: 19;
      }

      &.next {
        opacity: 0.6;
        transform: scale(0.85) translate3d(-25%, 0, -100px);
        z-index: 18;
      }
    }

    i {
      width: 17.5%;
      display: none;
      position: absolute;
      top: 40%;
      font-size: 22px;
      color: rgba(255, 255, 255, 0.5);
      text-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
      // cursor: pointer;
      z-index: 21;

      &:first-child {
        left: 0;
      }

      &:last-child {
        right: 0;
      }
    }

    &:hover {
      i {
        color: rgba(255, 255, 255, 0.8);
        display: block;
      }
    }

    &.mask {
      .slider {
        &.prev,
        &.next {
          &:before {
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
        .banner-tag {
          position: absolute;
          right: 0;
          bottom: 0;
          padding: 0 10px;
          font-size: 12px;
          color: #fff;
          border-radius: 8px 0;
          line-height: 21px;
        }
      }
    }
  }

  .dots {
    width: 100%;
    height: 20px;
    margin-top: 10px;
    span {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin: 1px 5px;
      border-radius: 50%;
      // cursor: pointer;
    }
  }
  & > i {
    display: none;
    position: absolute;
    width: 23px;
    height: 23px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    cursor: pointer;
    pointer-events: none;
  }
  &:hover > i {
    display: block;
  }
  .left-btn {
    left: 20px;
    background: url(~@/assets/images/next1.png) center/100% no-repeat;
  }
  .right-btn {
    right: 10px;
    background: url(~@/assets/images/prev1.png) center/100% no-repeat;
  }
}
</style>