<template>
  <div class="aplayer-volume-wrap">
    <div :class="`aplayer-icon-${volumeIcon}`" @click="$emit('togglemute')"></div>
    <!-- <icon-button
      :class="`aplayer-icon-${volumeIcon}`"
      :icon="volumeIcon"
      @click.native="$emit('togglemute')"
    /> -->
    <div class="aplayer-volume-bar-wrap" @mousedown="onBarMouseDown">
      <div class="aplayer-volume-bar" ref="bar">
        <div
          class="aplayer-volume"
          :style="{
            height: muted ? 0 : `${Math.trunc(volume * 100)}%`,
            background: theme
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from "../components/aplayer-iconbutton.vue";
import { getElementViewTop } from "../js/utils";

const barHeight = 77;

export default {
  components: {
    IconButton
  },
  props: ["volume", "muted", "theme"],
  computed: {
    volumeIcon() {
      if (this.muted || this.volume <= 0) return "volume-off";
      if (this.volume >= 1) return "volume-up";
      return "volume-down";
    }
  },
  methods: {
    adjustVolume(e) {
      let percentage =
        (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;
      this.$emit("setvolume", percentage);
    },
    onBarMouseDown() {
      document.addEventListener("mousemove", this.onDocumentMouseMove);
      document.addEventListener("mouseup", this.onDocumentMouseUp);
    },
    onDocumentMouseMove(e) {
      let percentage =
        (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;
      this.$emit("setvolume", percentage);
    },
    onDocumentMouseUp(e) {
      document.removeEventListener("mouseup", this.onDocumentMouseUp);
      document.removeEventListener("mousemove", this.onDocumentMouseMove);

      let percentage =
        (barHeight - e.clientY + getElementViewTop(this.$refs.bar)) / barHeight;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;
      this.$emit("setvolume", percentage);
    }
  }
};
</script>

<style lang="scss">
.aplayer-volume-wrap {
  position: relative;
  cursor: pointer;
  z-index: 0;
  top:-5px;

  &:hover .aplayer-volume-bar-wrap {
    display: block;
  }
  .aplayer-icon-volume-down {
    width: 20px;
    height: 30px;
    background: url(~@/assets/images/yl.png) bottom no-repeat;
    background-size: 20px 20px;
  }
  .aplayer-icon-volume-off {
    background: url(~@/assets/images/jy.png) bottom no-repeat;
    background-size: 20px 20px;
    width: 20px;
    height: 30px;
  }
  .aplayer-volume-bar-wrap {
    display: none;
    position: absolute;
    bottom: 27px;
    left: -4px;
    right: -4px;
    height: 104px;
    z-index: -1;
    width: 30px;
    background-color: rgb(54, 54, 54);
    transition: all 0.2s ease;
    border-radius:4px;
    .aplayer-volume-bar {
      position: absolute;
      bottom: 11px;
      left: 13px;
      width: 5px;
      height: 77px;
      background: #aaa;
      border-radius: 2.5px;
      overflow: hidden;
      z-index: 100000;

      .aplayer-volume {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        transition: height 0.1s ease, background-color 0.3s;
        will-change: height;
        background: rgb(195, 70, 58);
      }
    }
  }
}
</style>