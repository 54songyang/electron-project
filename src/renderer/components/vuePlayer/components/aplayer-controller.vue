<template>
  <div class="aplayer-controller">
    <v-progress
      :loadProgress="loadProgress"
      :playProgress="playProgress"
      :theme="theme"
      @dragbegin="val => $emit('dragbegin', val)"
      @dragend="val => $emit('dragend', val)"
      @dragging="val => $emit('dragging', val)"
    />
    <div class="aplayer-time">
      <div class="aplayer-time-inner">
        <span class="aplayer-ptime">{{secondToTime(stat.playedTime)}}</span> /
        <span class="aplayer-dtime">{{secondToTime(stat.duration)}}</span>
      </div>
      <div class="btn-box">
        <!-- <icon-button
          class="aplayer-icon-mode"
          icon="shuffle"
          :class="{ 'inactive': !shuffle }"
          @click.native="$emit('toggleshuffle')"
        />-->
        <!-- <icon-button
          class="aplayer-icon-mode"
          :icon="repeat === 'repeat-one' ? 'repeat-one' : 'repeat-all'"
          :class="{ 'inactive': repeat === 'no-repeat'}"
          @click.native="$emit('nextmode')"
        /> -->
        <!-- <icon-button
          class="aplayer-icon-menu"
          icon="menu"
          :class="{ 'inactive': !$parent.showList }"
          @click.native="$emit('togglelist')"
        />-->
        <div class="play-btn play-tree"></div>
        <div :class="['play-btn',repeat]" @click="$emit('nextmode')"></div>
        <div class="play-btn play-lb" @click="$emit('togglelist')"></div>
        <div class="play-btn play-gc"></div>
        <volume
          v-if="!$parent.isMobile"
          :volume="volume"
          :theme="theme"
          :muted="muted"
          @togglemute="$emit('togglemute')"
          @setvolume="v => $emit('setvolume', v)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from "../components/aplayer-iconbutton.vue";
import VProgress from "../components/aplayer-controller-progress.vue";
import Volume from "../components/aplayer-controller-volume.vue";

export default {
  components: {
    IconButton,
    VProgress,
    Volume
  },
  props: ["shuffle", "repeat", "stat", "theme", "volume", "muted"],
  computed: {
    loadProgress() {
      if (this.stat.duration === 0) return 0;
      return this.stat.loadedTime / this.stat.duration;
    },
    playProgress() {
      if (this.stat.duration === 0) return 0;
      return this.stat.playedTime / this.stat.duration;
    }
  },
  watch: {
    repeat(val) {
      console.log("t4903943904", val);
    }
  },
  mounted(){
    console.log('t4903943904',this.repeat);
  },
  methods: {
    secondToTime(second) {
      if (isNaN(second)) {
        return "00:00";
      }
      const pad0 = num => {
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
    }
  }
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
    .btn-box {
      display: flex;
      width: 200px;
      justify-content: space-around;
      align-items: center;
      position: relative;
      bottom: 7px;
      right: 17px;
      .play-btn {
        width: 18px;
        height: 18px;
      }
      .aplayer-icon-mode {
        background: #fff;
      }
      .repeat-all {
        background: url(~@/assets/images/xh.png) no-repeat;
        background-size: 100% 100%;
      }
      .repeat-one {
        background: url(~@/assets/images/dq.png) no-repeat;
        background-size: 100% 100%;
      }
      .no-repeat {
        background: url(~@/assets/images/sx.png) no-repeat;
        background-size: 100% 100%;
      }
      .suiji {
        background: url(~@/assets/images/sj.png) no-repeat;
        background-size: 100% 100%;
      }
      .play-gc {
        background: url(~@/assets/images/gc.png) no-repeat;
        background-size: 100% 100%;
      }
      .play-tree {
        background: url(~@/assets/images/tree.png) no-repeat;
        background-size: 100% 100%;
      }
      .play-lb {
        background: url(~@/assets/images/lb.png) no-repeat;
        background-size: 100% 100%;
      }
    }

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