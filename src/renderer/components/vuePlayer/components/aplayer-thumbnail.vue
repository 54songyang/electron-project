<template>
  <div class="aplayer-pic">
    <div
      class="aplayer-button"
      :class="playing ? 'aplayer-pause' : 'aplayer-play'"
      @mousedown="onDragBegin"
      @click="onClick"
    >
      <div :class="playing ? 'aplayer-icon-pause' : 'aplayer-icon-play'"></div>
    </div>
  </div>
</template>
<script>
import IconButton from "../components/aplayer-iconbutton.vue";

export default {
  components: {
    IconButton
  },
  props: {
    pic: String,
    theme: String,
    playing: {
      type: Boolean,
      default: false
    },
    enableDrag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasMovedSinceMouseDown: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  computed: {
    currentPicStyleObj() {
      if (!this.pic) return {};
      return {
        backgroundImage: `url(${this.pic})`,
        backgroundColor: this.theme
      };
    }
  },
  methods: {
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
        offsetTop: e.clientY - this.dragStartY
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
    }
  }
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
  cursor: pointer;
  &:hover {
    .aplayer-button {
      opacity: 1;
    }
  }
  .aplayer-button {
    position: absolute;
    border-radius: 50%;
    transition: all 0.1s ease;

    .aplayer-fill {
      fill: #fff;
    }
  }

  .aplayer-play,
  .aplayer-pause {
    width: 40px;
    height: 40px;
    bottom: 50%;
    right: calc(50% + 30px);
    margin: 0 -15px -15px 0;
    background-color: rgb(195, 70, 58);
    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .aplayer-icon-play {
      width: 100%;
      height: 100%;
      background: url(~@/assets/images/play-btn.png) center center no-repeat;
      background-size: 22px 22px;
    }
    .aplayer-icon-pause {
      width: 22px;
      height: 22px;
      background: url(~@/assets/images/end-btn.png) center center no-repeat;
      background-size: 22px 22px;
    }
  }
}
</style>