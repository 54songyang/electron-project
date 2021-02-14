<template>
  <div class="aplayer-controller">
    <v-progress
      :loadProgress="loadProgress"
      :playProgress="playProgress"
      :theme="theme"
      @dragbegin="(val) => $emit('dragbegin', val)"
      @dragend="(val) => $emit('dragend', val)"
      @dragging="(val) => $emit('dragging', val)"
    />
    <div class="aplayer-time">
      <div class="aplayer-time-inner">
        <span class="aplayer-ptime">{{ secondToTime(stat.playedTime) }}</span> /
        <!-- <span class="aplayer-dtime">{{secondToTime(stat.duration)}}</span> -->
        <span class="aplayer-dtime">{{ dt | durationFilter }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from "../components/aplayer-iconbutton.vue";
import VProgress from "../components/aplayer-controller-progress.vue";

export default {
  components: {
    IconButton,
    VProgress,
  },
  props: ["shuffle", "stat", "theme", "muted", "dt"],
  computed: {
    loadProgress() {
      if (this.stat.duration === 0) return 0;
      return this.stat.loadedTime / this.stat.duration;
    },
    playProgress() {
      if (this.stat.duration === 0) return 0;
      return this.stat.playedTime / this.stat.duration;
    },
  },
  methods: {
    secondToTime(second) {
      if (isNaN(second)) {
        return "00:00";
      }
      const pad0 = (num) => {
        return num < 10 ? "0" + num : "" + num;
      };

      const min = Math.trunc(second / 60);
      const sec = Math.trunc(second - min * 60);
      const hours = Math.trunc(min / 60);
      const minAdjust = Math.trunc(
        second / 60 - 60 * Math.trunc(second / 60 / 60)
      );
      return second >= 3600
        ? pad0(hours) + ":" + pad0(minAdjust) + ":" + pad0(sec)
        : pad0(min) + ":" + pad0(sec);
    },
  },
  filters: {
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
};
</script>

<style lang="scss">
.aplayer-controller {
  display: flex;
  align-items: center;
  position: relative;

  .aplayer-time {
    display: flex;
    justify-content: space-between;
    position: absolute;
    height: 17px;
    color: rgb(102, 102, 102);
    font-size: 13px;
    top: 30px;
    width: 100%;

    .aplayer-icon {
      cursor: pointer;
      transition: all 0.2s ease;
      margin-left: 4px;

      &.inactive {
        opacity: 0.3;
      }

      .aplayer-fill {
        fill: #666;
      }

      &:hover {
        .aplayer-fill {
          fill: #000;
        }
      }

      &.aplayer-icon-menu {
        display: none;
      }
    }
    .aplayer-volume-wrap + .aplayer-icon {
      margin-left: 0;
    }

    &.aplayer-time-narrow {
      .aplayer-icon-mode {
        display: none;
      }

      .aplayer-icon-menu {
        display: none;
      }
    }
  }
}
</style>