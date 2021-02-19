<template>
  <div class="lyrics-wrapper aplayer-lrc">
    <div class="content aplayer-lrc-contents" :style="transformStyle">
      <p
        v-for="(line, index) of lrcLines"
        :key="index"
        :class="{ 'aplayer-lrc-current': index === currentLineIndex }"
      >
        {{ line[1] }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import { parseLrc } from "../js/utils";
export default {
  props: {
    playStat: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      displayLrc: "",
      currentLineIndex: 0,
      setTimeFn: null,
    };
  },
  computed: {
    lrcLines() {
      return parseLrc(this.displayLrc);
    },
    currentLine() {
      if (this.currentLineIndex > this.lrcLines.length - 1) {
        return null;
      }
      return this.lrcLines[this.currentLineIndex];
    },
    transformStyle() {
      if (this.currentLineIndex < 7) {
        return {
          transform: `translateY(${-this.currentLineIndex * 20}px)`,
        };
      } else {
        return {
          transform: `translateY(${-(
            140 +
            (this.currentLineIndex - 7) * 40
          )}px)`,
        };
      }
    },
    playIndex() {
      return this.$store.state.music.active;
    },
    currentMusic() {
      return this.$store.state.music.currentMusic;
    },
    showLrcPop() {
      return this.$store.state.music.showLrcPop;
    },
    playType() {
      return this.$store.state.music.playType;
    },
  },
  mounted() {
    document
      .querySelector(".aplayer-lrc")
      .addEventListener("scroll", this.debounce(this.turnBack, 1000));
    document
      .querySelector(".aplayer-lrc")
      .addEventListener("mouseup", function () {
        console.log("getSelectedHtml", window.getSelection().getRangeAt(0));
      });
  },
  beforeDestroy() {
    document
      .querySelector(".aplayer-lrc")
      .removeEventListener("scroll", this.debounce(this.turnBack, 1000));
  },
  methods: {
    ...mapMutations(["SET_SHOWLRCPOP", "SET_MUSIC"]),
    ...mapActions(["musicLrc"]),
    applyLrc(lrc) {
      if (/^https?:\/\//.test(lrc)) {
        this.fetchLrc(lrc);
      } else {
        this.displayLrc = lrc;
      }
    },
    fetchLrc(src) {
      fetch(src)
        .then((response) => response.text())
        .then((lrc) => {
          this.displayLrc = lrc;
        });
    },
    hideLrc() {
      this.displayLrc = "";
    },
    debounce(fn, wait) {
      var timer = null;
      return function () {
        var context = this;
        var args = arguments;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, wait);
      };
    },
    turnBack(e) {
      this.setTimeFn = setTimeout(() => {
        e.target.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        this.setTimeFn = null;
      }, 5000);
    },
    async lyricsChannel() {
      if (this.playType !== "PLAY_LIST") return;
      this.currentLineIndex = 0;
      const lrc = this.currentMusic.lrc;
      this.SET_SHOWLRCPOP(!this.showLrcPop);
      if (!lrc) {
        const res = await this.musicLrc(this.currentMusic.id);
        this.SET_MUSIC({ lrc: res });
        console.log("this.currentMusic.lrc", this.currentMusic.lrc);
        this.applyLrc(res);
      } else {
        this.applyLrc(lrc);
      }
      // if (lrc) {
      //   this.applyLrc(lrc);
      // } else {
      //   this.hideLrc();
      // }
    },
  },
  watch: {
    "playStat.playedTime"(playedTime) {
      for (let i = 0; i < this.lrcLines.length; i++) {
        const line = this.lrcLines[i];
        const nextLine = this.lrcLines[i + 1];
        if (playedTime >= line[0] && (!nextLine || playedTime < nextLine[0])) {
          this.currentLineIndex = i;
        }
      }
    },
  },
};
</script>
<style lang="scss">
@import "../scss/variables.scss";

.aplayer-lrc {
  position: relative;
  height: $lrc-height;
  overflow: hidden;
  margin-bottom: 7px;
  .aplayer-lrc-current {
    opacity: 1;
    overflow: visible;
    height: initial;
    font-size: 16px;
    color: #fff;
  }

  .aplayer-lrc-contents {
    p {
      user-select: text;
      -webkit-user-select: text;
    }
    // width: 100%;
    transition: all 0.5s ease-out;
    user-select: text;
    // cursor: default;
    // border-right: 1px solid rgb(54, 54, 54);
  }
}
</style>