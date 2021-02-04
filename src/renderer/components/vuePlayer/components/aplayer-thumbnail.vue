<template>
  <div class="aplayer-pic">
    <div class="collection" @click="toCollection"></div>
    <div class="next" @click="next"></div>
    <div
      class="aplayer-button"
      :class="playing ? 'aplayer-pause' : 'aplayer-play'"
      @mousedown="onDragBegin"
      @click="onClick"
    >
      <div :class="playing ? 'aplayer-icon-pause' : 'aplayer-icon-play'"></div>
    </div>
    <div class="prev" @click="prev"></div>
    <div class="share"></div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import IconButton from "../components/aplayer-iconbutton.vue";

export default {
  components: {
    IconButton,
  },
  props: {
    theme: String,
    playing: {
      type: Boolean,
      default: false,
    },
    enableDrag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasMovedSinceMouseDown: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  methods: {
    ...mapMutations(["SET_ACTIVE"]),
    onDragBegin(e) {
      if (this.enableDrag) {
        this.hasMovedSinceMouseDown = false;
        this.$emit("dragbegin");
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        document.addEventListener("mousemove", this.onDocumentMouseMove);
        document.addEventListener("mouseup", this.onDocumentMouseUp);
      }
    },
    onDocumentMouseMove(e) {
      this.hasMovedSinceMouseDown = true;
      this.$emit("dragging", {
        offsetLeft: e.clientX - this.dragStartX,
        offsetTop: e.clientY - this.dragStartY,
      });
    },
    onDocumentMouseUp(e) {
      document.removeEventListener("mouseup", this.onDocumentMouseUp);
      document.removeEventListener("mousemove", this.onDocumentMouseMove);

      this.$emit("dragend");
    },
    onClick() {
      if (!this.hasMovedSinceMouseDown) {
        this.$emit("toggleplay");
      }
    },
    next() {
      //下一首
      const { musicList, active } = this.$store.state.music.videoUpload;
      if (active === 0) return;
      let index = active - 1;
      this.SET_ACTIVE(index)
    },
    prev(){
      //上一首
      const { musicList, active } = this.$store.state.music.videoUpload;
      if (active === musicList.length - 1) return;
      let index = active + 1;
      this.SET_ACTIVE(index)
    },
    toCollection() {
      console.log("收藏",);
      //收藏按钮
      //sc-red.png
    },
  },
};
</script>

<style lang="scss">
@import "../scss/variables.scss";

.aplayer-float {
  .aplayer-pic:active {
    cursor: move;
  }
}

.aplayer-pic {
  flex-shrink: 0;
  height: 60px;
  background-size: cover;
  transition: all 0.3s ease;
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: default;
  &:hover {
    .aplayer-button {
      opacity: 1;
    }
  }
  .aplayer-button {
    // position: absolute;
    border-radius: 50%;
    transition: all 0.1s ease;

    .aplayer-fill {
      fill: #fff;
    }
  }
  .next,
  .prev {
    background: url(~@/assets/images/change-red.png) no-repeat;
    background-size: 100% 100%;
    width: 14px;
    height: 14px;
    transform: rotate(-180deg);
  }
  .next {
    transform: rotate(0deg);
  }
  .collection {
    background: url(~@/assets/images/sc-white.png) no-repeat;
    background-size: 100% 100%;
    width: 15px;
    height: 14px;
  }
  .share {
    background: url(~@/assets/images/share.png) no-repeat;
    background-size: 100% 100%;
    width: 14px;
    height: 13px;
  }
  .aplayer-play,
  .aplayer-pause {
    width: 40px;
    height: 40px;
    background-color: rgb(195, 70, 58);
    .aplayer-icon-play {
      width: 100%;
      height: 100%;
      background: url(~@/assets/images/play-btn.png) center center no-repeat;
      background-size: 22px 22px;
      margin-left: 1px;
    }
    .aplayer-icon-pause {
      width: 100%;
      height: 100%;
      background: url(~@/assets/images/end-btn.png) center center no-repeat;
      background-size: 22px 22px;
    }
  }
}
</style>