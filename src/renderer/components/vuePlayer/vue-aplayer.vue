<template>
  <div
    class="aplayer"
    :class="{
      'aplayer-narrow': isMiniMode,
      'aplayer-withlist' : !isMiniMode && musicList.length > 0,
      'aplayer-withlrc': !isMiniMode && (!!$slots.display || shouldShowLrc),
      'aplayer-float': isFloatMode,
      'aplayer-loading': isPlaying && isLoading
    }"
    :style="floatStyleObj"
  >
    <div class="img-box" @click="lyricsChannel">
      <i :class="[showLrcPop?'retract-pop':'open-pop']"></i>
      <div class="blur-box">
        <img :src="currentMusic.pic" alt />
      </div>
    </div>
    <div class="aplayer-body">
      <thumbnail
        :pic="currentMusic.pic"
        :playing="isPlaying"
        :enable-drag="isFloatMode"
        :theme="currentTheme"
        @toggleplay="toggle"
        @dragbegin="onDragBegin"
        @dragging="onDragAround"
      />
      <div class="aplayer-info" v-show="!isMiniMode">
        <controls
          :shuffle="shouldShuffle"
          :repeat="repeatMode"
          :stat="playStat"
          :volume="audioVolume"
          :muted="isAudioMuted"
          :theme="currentTheme"
          @toggleshuffle="shouldShuffle = !shouldShuffle"
          @togglelist="showList = !showList"
          @togglemute="toggleMute"
          @setvolume="setAudioVolume"
          @dragbegin="onProgressDragBegin"
          @dragend="onProgressDragEnd"
          @dragging="onProgressDragging"
          @nextmode="setNextMode"
        />
        <div class="aplayer-music">
          <span class="aplayer-title">{{ currentMusic.title || 'Untitled' }}</span>
          <span
            class="aplayer-author"
          >-{{ currentMusic.artist || currentMusic.author || 'Unknown' }}</span>
        </div>
        <!-- <slot name="display" :current-music="currentMusic" :play-stat="playStat"> -->
        <!-- <lyrics :current-music="currentMusic" :play-stat="playStat" v-if="shouldShowLrc" /> -->
        <!-- </slot> -->
      </div>
    </div>
    <audio ref="audio"></audio>
    <music-list
      :show="showList && !isMiniMode"
      :current-music="currentMusic"
      :music-list="musicList"
      :play-index="playIndex"
      :listmaxheight="listmaxheight || listMaxHeight"
      :theme="currentTheme"
      @selectsong="onSelectSong"
    />
    <div :class="['lyrics-box',{'lyrics-top':showLrcPop}]">
      <!-- <div class="lyrics-box lyrics-top"> -->
      <div :class="['lyrics-player',isPlaying?'pointer-play':'pointer-end']">
        <div class="pointer">
          <i class="lyrics-raido"></i>
          <img src="@/assets/images/pointer.png" alt />
        </div>
        <div class="dish">
          <img :src="currentMusic.pic" />
        </div>
        <div class="lyrics-btn-box">
          <div class="sc"></div>
          <div class="tj"></div>
          <div class="xz"></div>
          <div class="fx"></div>
        </div>
      </div>
      <div class="lyrics-info">
        <lyrics :current-music="currentMusic" :play-stat="playStat" />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import Vue from "vue";
import Thumbnail from "./components/aplayer-thumbnail.vue";
import MusicList from "./components/aplayer-list.vue";
import Controls from "./components/aplayer-controller.vue";
import Lyrics from "./components/aplayer-lrc.vue";
import { deprecatedProp, versionCompare, warn } from "./js/utils";
import { mapActions } from "vuex";

let versionBadgePrinted = false;
const canUseSync = versionCompare(Vue.version, "2.3.0") >= 0;

/**
 * memorize self-adapting theme for cover image urls
 * @type {Object.<url, rgb()>}
 */
const picThemeCache = {};

// mutex playing instance
let activeMutex = null;

const REPEAT = {
  NONE: "none",
  MUSIC: "music",
  LIST: "list",
  NO_REPEAT: "no-repeat",
  REPEAT_ONE: "repeat-one",
  REPEAT_ALL: "repeat-all"
};

const VueAPlayer = {
  name: "APlayer",
  disableVersionBadge: false,
  components: {
    Thumbnail,
    Controls,
    MusicList,
    Lyrics
  },
  props: {
    music: {
      type: Object,
      required: true,
      validator(song) {
        if (song.url) {
          deprecatedProp("music.url", "1.4.0", "music.src");
        }
        if (song.author) {
          deprecatedProp("music.author", "1.4.1", "music.artist");
        }
        return song.src || song.url;
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    mini: {
      type: Boolean,
      default: false
    },
    showLrc: {
      type: Boolean,
      default: false
    },
    mutex: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: "#c3463a"
    },

    listMaxHeight: String,
    /**
     * @since 1.4.1
     * Fold playlist initially
     */
    listFolded: {
      type: Boolean,
      default: false
    },

    /**
     * @since 1.2.0 Float mode
     */
    float: {
      type: Boolean,
      default: false
    },

    // Audio attributes as props
    // since 1.4.0
    // autoplay controls muted preload volume
    // autoplay is not observable

    /**
     * @since 1.4.0
     * not observable
     */
    autoplay: {
      type: Boolean,
      default: false
    },

    /**
     * @since 1.4.0
     * whether to show native audio controls below Vue-APlayer
     * only work in development environment and not mini mode
     *
     * observable
     */
    controls: {
      type: Boolean,
      default: false
    },

    /**
     * @since 1.4.0
     * observable, sync
     */
    muted: {
      type: Boolean,
      default: false
    },
    /**
     * @since 1.4.0
     * observable
     */
    preload: String,

    /**
     * @since 1.4.0
     * observable, sync
     */
    volume: {
      type: Number,
      default: 0.8,
      validator(value) {
        return value >= 0 && value <= 1;
      }
    },

    // play order control
    // since 1.5.0

    /**
     * @since 1.5.0
     * @see https://support.apple.com/en-us/HT207230
     * twoWay
     */
    shuffle: {
      type: Boolean,
      default: false
    },
    /**
     * @since 1.5.0
     * @see https://support.apple.com/en-us/HT207230
     * twoWay
     */
    repeat: {
      type: String,
      default: REPEAT.NO_REPEAT
    },

    // deprecated props

    /**
     * @deprecated since 1.1.2, use listMaxHeight instead
     */
    listmaxheight: {
      type: String,
      validator(value) {
        if (value) {
          deprecatedProp("listmaxheight", "1.1.2", "listMaxHeight");
        }
        return true;
      }
    },
    /**
     * @deprecated since 1.1.2, use mini instead
     */
    narrow: {
      type: Boolean,
      default: false,
      validator(value) {
        if (value) {
          deprecatedProp("narrow", "1.1.2", "mini");
        }
        return true;
      }
    },
    /**
     * @deprecated since 1.2.2
     */
    showlrc: {
      type: Boolean,
      default: false,
      validator(value) {
        if (value) {
          deprecatedProp("showlrc", "1.2.2", "showLrc");
        }
        return true;
      }
    }
    /**
     * @deprecated and REMOVED since 1.5.0
     */
    // mode: {
    //   type: String,
    //   default: 'circulation',
    //   validator (value) {
    //     if (value) {
    //       deprecatedProp('mode', '1.5.0', 'shuffle and repeat')
    //     }
    //     return true
    //   }
    // },
  },
  data() {
    return {
      internalMusic: this.music,
      isPlaying: false,
      isSeeking: false,
      wasPlayingBeforeSeeking: false,
      isMobile: /mobile/i.test(window.navigator.userAgent),
      playStat: {
        duration: 0,
        loadedTime: 0,
        playedTime: 0
      },
      showList: !this.listFolded,

      // handle Promise returned from audio.play()
      // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
      audioPlayPromise: Promise.resolve(),

      // @since 1.2.0 float mode

      floatOriginX: 0,
      floatOriginY: 0,
      floatOffsetLeft: 0,
      floatOffsetTop: 0,

      // @since 1.3.0 self adapting theme
      selfAdaptingTheme: null,

      // @since 1.4.0
      // sync muted, volume

      internalMuted: this.muted,
      internalVolume: this.volume,

      // @since 1.4.1
      // Loading indicator
      isLoading: false,

      // @since 1.5.1
      // sync shuffle, repeat
      internalShuffle: this.shuffle,
      internalRepeat: this.repeat,
      // for shuffling
      shuffledList: []
    };
  },
  computed: {
    showLrcPop(){
      return this.$store.state.page.showLrcPop;
    },
    // alias for $refs.audio
    audio() {
      return this.$refs.audio;
    },

    // sync music
    currentMusic: {
      get() {
        return this.internalMusic;
      },
      set(val) {
        canUseSync && this.$emit("update:music", val);
        this.internalMusic = val;
      }
    },
    // compatible for deprecated props
    isMiniMode() {
      return this.mini || this.narrow;
    },
    shouldShowLrc() {
      return this.showLrc || this.showlrc;
    },

    // props wrappers

    currentTheme() {
      return this.selfAdaptingTheme || this.currentMusic.theme || this.theme;
    },
    isFloatMode() {
      return this.float && !this.isMobile;
    },
    shouldAutoplay() {
      if (this.isMobile) return false;
      return this.autoplay;
    },
    musicList() {
      return this.list;
    },
    shouldShowNativeControls() {
      return (
        process.env.NODE_ENV !== "production" &&
        this.controls &&
        !this.isMiniMode
      );
    },

    // useful

    floatStyleObj() {
      // transform: translate(floatOffsetLeft, floatOffsetY)
      return {
        transform: `translate(${this.floatOffsetLeft}px, ${this.floatOffsetTop}px)`,
        webkitTransform: `translate(${this.floatOffsetLeft}px, ${this.floatOffsetTop}px)`
      };
    },
    currentPicStyleObj() {
      if (this.currentMusic && this.currentMusic.pic) {
        return {
          backgroundImage: `url(${this.currentMusic.pic})`
        };
      }
      return {};
    },
    loadProgress() {
      if (this.playStat.duration === 0) return 0;
      return this.playStat.loadedTime / this.playStat.duration;
    },
    playProgress() {
      if (this.playStat.duration === 0) return 0;
      return this.playStat.playedTime / this.playStat.duration;
    },
    playIndex: {
      get() {
        return this.shuffledList.indexOf(this.currentMusic);
      },
      set(val) {
        this.currentMusic = this.shuffledList[val % this.shuffledList.length];
      }
    },
    shouldRepeat() {
      return this.repeatMode !== REPEAT.NO_REPEAT;
    },

    // since 1.4.0
    // sync muted, volume

    isAudioMuted: {
      get() {
        return this.internalMuted;
      },
      set(val) {
        canUseSync && this.$emit("update:muted", val);
        this.internalMuted = val;
      }
    },
    audioVolume: {
      get() {
        return this.internalVolume;
      },
      set(val) {
        canUseSync && this.$emit("update:volume", val);
        this.internalVolume = val;
      }
    },

    // since 1.5.0
    // sync shuffle, repeat
    shouldShuffle: {
      get() {
        return this.internalShuffle;
      },
      set(val) {
        canUseSync && this.$emit("update:shuffle", val);
        this.internalShuffle = val;
      }
    },
    repeatMode: {
      get() {
        switch (this.internalRepeat) {
          case REPEAT.NONE:
          case REPEAT.NO_REPEAT:
            return REPEAT.NO_REPEAT;
          case REPEAT.MUSIC:
          case REPEAT.REPEAT_ONE:
            return REPEAT.REPEAT_ONE;
          default:
            return REPEAT.REPEAT_ALL;
        }
      },
      set(val) {
        canUseSync && this.$emit("update:repeat", val);
        this.internalRepeat = val;
      }
    }
  },
  methods: {
    ...mapActions(['changeLrcPop']),
    // Float mode

    onDragBegin() {
      this.floatOriginX = this.floatOffsetLeft;
      this.floatOriginY = this.floatOffsetTop;
    },
    onDragAround({ offsetLeft, offsetTop }) {
      this.floatOffsetLeft = this.floatOriginX + offsetLeft;
      this.floatOffsetTop = this.floatOriginY + offsetTop;
    },

    // functions

    setNextMode() {
      if (this.repeatMode === REPEAT.REPEAT_ALL) {
        this.repeatMode = REPEAT.REPEAT_ONE;
      } else if (this.repeatMode === REPEAT.REPEAT_ONE) {
        this.repeatMode = REPEAT.NO_REPEAT;
      } else {
        this.repeatMode = REPEAT.REPEAT_ALL;
      }
    },
    thenPlay() {
      this.$nextTick(() => {
        this.play();
      });
    },

    // controls

    // play/pause

    toggle() {
      if (!this.audio.paused) {
        this.pause();
      } else {
        this.play();
      }
    },
    play() {
      if (this.mutex) {
        if (activeMutex && activeMutex !== this) {
          activeMutex.pause();
        }
        activeMutex = this;
      }
      // handle .play() Promise
      const audioPlayPromise = this.audio.play();
      if (audioPlayPromise) {
        return (this.audioPlayPromise = new Promise((resolve, reject) => {
          // rejectPlayPromise is to force reject audioPlayPromise if it's still pending when pause() is called
          this.rejectPlayPromise = reject;
          audioPlayPromise
            .then(res => {
              this.rejectPlayPromise = null;
              resolve(res);
            })
            .catch(warn);
        }));
      }
    },
    pause() {
      this.audioPlayPromise
        .then(() => {
          this.audio.pause();
        })
        // Avoid force rejection throws Uncaught
        .catch(() => {
          this.audio.pause();
        });

      // audioPlayPromise is still pending
      if (this.rejectPlayPromise) {
        // force reject playPromise
        this.rejectPlayPromise();
        this.rejectPlayPromise = null;
      }
    },

    // progress bar

    onProgressDragBegin(val) {
      this.wasPlayingBeforeSeeking = this.isPlaying;
      this.pause();
      this.isSeeking = true;

      // handle load failures
      if (!isNaN(this.audio.duration)) {
        this.audio.currentTime = this.audio.duration * val;
      }
    },
    onProgressDragging(val) {
      if (isNaN(this.audio.duration)) {
        this.playStat.playedTime = 0;
      } else {
        this.audio.currentTime = this.audio.duration * val;
      }
    },
    onProgressDragEnd(val) {
      this.isSeeking = false;

      if (this.wasPlayingBeforeSeeking) {
        this.thenPlay();
      }
    },

    // volume

    toggleMute() {
      this.setAudioMuted(!this.audio.muted);
    },
    setAudioMuted(val) {
      this.audio.muted = val;
    },
    setAudioVolume(val) {
      this.audio.volume = val;
      if (val > 0) {
        this.setAudioMuted(false);
      }
    },

    // playlist

    getShuffledList() {
      if (!this.list.length) {
        return [this.internalMusic];
      }
      let unshuffled = [...this.list];
      if (!this.internalShuffle || unshuffled.length <= 1) {
        return unshuffled;
      }

      let indexOfCurrentMusic = unshuffled.indexOf(this.internalMusic);
      if (unshuffled.length === 2 && indexOfCurrentMusic !== -1) {
        if (indexOfCurrentMusic === 0) {
          return unshuffled;
        } else {
          return [this.internalMusic, unshuffled[0]];
        }
      }
      // shuffle list
      // @see https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
      for (let i = unshuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = unshuffled[i];
        unshuffled[i] = unshuffled[j];
        unshuffled[j] = tmp;
      }

      // take currentMusic to first
      if (indexOfCurrentMusic !== -1) {
        indexOfCurrentMusic = unshuffled.indexOf(this.internalMusic);
        if (indexOfCurrentMusic !== 0) {
          [unshuffled[0], unshuffled[indexOfCurrentMusic]] = [
            unshuffled[indexOfCurrentMusic],
            unshuffled[0]
          ];
        }
      }

      return unshuffled;
    },

    onSelectSong(song) {
      if (this.currentMusic === song) {
        this.toggle();
      } else {
        this.currentMusic = song;
        this.thenPlay();
      }
    },

    // event handlers
    // for keeping up with audio states

    onAudioPlay() {
      this.isPlaying = true;
    },
    onAudioPause() {
      this.isPlaying = false;
    },
    onAudioWaiting() {
      this.isLoading = true;
    },
    onAudioCanplay() {
      this.isLoading = false;
    },
    onAudioDurationChange() {
      if (this.audio.duration !== 1) {
        this.playStat.duration = this.audio.duration;
      }
    },
    onAudioProgress() {
      if (this.audio.buffered.length) {
        this.playStat.loadedTime = this.audio.buffered.end(
          this.audio.buffered.length - 1
        );
      } else {
        this.playStat.loadedTime = 0;
      }
    },
    onAudioTimeUpdate() {
      this.playStat.playedTime = this.audio.currentTime;
    },
    onAudioSeeking() {
      this.playStat.playedTime = this.audio.currentTime;
    },
    onAudioSeeked() {
      this.playStat.playedTime = this.audio.currentTime;
    },
    onAudioVolumeChange() {
      this.audioVolume = this.audio.volume;
      this.isAudioMuted = this.audio.muted;
    },
    /**
     * 播放顺序
     */
    onAudioEnded() {
      // determine next song according to shuffle and repeat
      if (this.repeatMode === REPEAT.REPEAT_ALL) {
        if (
          this.shouldShuffle &&
          this.playIndex === this.shuffledList.length - 1
        ) {
          this.shuffledList = this.getShuffledList();
        }
        this.playIndex++;
        this.thenPlay();
      } else if (this.repeatMode === REPEAT.REPEAT_ONE) {
        this.thenPlay();
      } else {
        this.playIndex++;
        if (this.playIndex !== 0) {
          this.thenPlay();
        } else if (this.shuffledList.length === 1) {
          this.audio.currentTime = 0;
        }
      }
    },

    initAudio() {
      // since 1.4.0 Audio attributes as props

      this.audio.controls = this.shouldShowNativeControls;
      this.audio.muted = this.muted;
      this.audio.preload = this.preload;
      this.audio.volume = this.volume;

      // since 1.4.0 Emit as many native audio events
      // @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events

      const mediaEvents = [
        "abort",
        "canplay",
        "canplaythrough",
        "durationchange",
        "emptied",
        "encrypted",
        "ended",
        "error",
        "interruptbegin",
        "interruptend",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "mozaudioavailable",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "seeked",
        "seeking",
        "stalled",
        "suspend",
        "timeupdate",
        "volumechange",
        "waiting"
      ];
      mediaEvents.forEach(event => {
        this.audio.addEventListener(event, e => this.$emit(event, e));
      });

      // event handlers
      // they don't emit native media events

      this.audio.addEventListener("play", this.onAudioPlay);
      this.audio.addEventListener("pause", this.onAudioPause);
      this.audio.addEventListener("abort", this.onAudioPause);
      this.audio.addEventListener("waiting", this.onAudioWaiting);
      this.audio.addEventListener("canplay", this.onAudioCanplay);
      this.audio.addEventListener("progress", this.onAudioProgress);
      this.audio.addEventListener("durationchange", this.onAudioDurationChange);
      this.audio.addEventListener("seeking", this.onAudioSeeking);
      this.audio.addEventListener("seeked", this.onAudioSeeked);
      this.audio.addEventListener("timeupdate", this.onAudioTimeUpdate);
      this.audio.addEventListener("volumechange", this.onAudioVolumeChange);
      this.audio.addEventListener("ended", this.onAudioEnded);

      if (this.currentMusic) {
        this.audio.src = this.currentMusic.src || this.currentMusic.url;
      }
    },

    setSelfAdaptingTheme() {
      // auto theme according to current music cover image
      if ((this.currentMusic.theme || this.theme) === "pic") {
        const pic = this.currentMusic.pic;
        // use cache
        if (picThemeCache[pic]) {
          this.selfAdaptingTheme = picThemeCache[pic];
        } else {
          try {
            new ColorThief().getColorAsync(pic, ([r, g, b]) => {
              picThemeCache[pic] = `rgb(${r}, ${g}, ${b})`;
              this.selfAdaptingTheme = `rgb(${r}, ${g}, ${b})`;
            });
          } catch (e) {
            warn("color-thief is required to support self-adapting theme");
          }
        }
      } else {
        this.selfAdaptingTheme = null;
      }
    },
    lyricsChannel() {
      this.changeLrcPop(!this.showLrcPop)
    }
  },
  watch: {
    music(music) {
      this.internalMusic = music;
    },

    currentMusic: {
      handler(music) {
        // async
        this.setSelfAdaptingTheme();

        const src = music.src || music.url;
        // HLS support
        if (/\.m3u8(?=(#|\?|$))/.test(src)) {
          if (
            this.audio.canPlayType("application/x-mpegURL") ||
            this.audio.canPlayType("application/vnd.apple.mpegURL")
          ) {
            this.audio.src = src;
          } else {
            try {
              const Hls = require("hls.js");
              if (Hls.isSupported()) {
                if (!this.hls) {
                  this.hls = new Hls();
                }
                this.hls.loadSource(src);
                this.hls.attachMedia(this.audio);
              } else {
                warn("HLS is not supported on your browser");
                this.audio.src = src;
              }
            } catch (e) {
              warn("hls.js is required to support m3u8");
              this.audio.src = src;
            }
          }
        } else {
          this.audio.src = src;
        }
        // self-adapting theme color
      }
    },

    // since 1.4.0
    // observe controls, muted, preload, volume

    shouldShowNativeControls(val) {
      this.audio.controls = val;
    },
    isAudioMuted(val) {
      this.audio.muted = val;
    },
    preload(val) {
      this.audio.preload = val;
    },
    audioVolume(val) {
      this.audio.volume = val;
    },

    // sync muted, volume

    muted(val) {
      this.internalMuted = val;
    },
    volume(val) {
      this.internalVolume = val;
    },

    // sync shuffle, repeat
    shuffle(val) {
      this.internalShuffle = val;
    },
    repeat(val) {
      this.internalRepeat = val;
    }
  },
  beforeCreate() {
    if (!VueAPlayer.disableVersionBadge && !versionBadgePrinted) {
      // version badge
      // console.log(
      //   `\n\n %c Vue-APlayer ${VERSION} %c vue-aplayer.js.org \n`,
      //   "color: #fff; background:#41b883; padding:5px 0;",
      //   "color: #fff; background: #35495e; padding:5px 0;"
      // );
      versionBadgePrinted = true;
    }
  },
  created() {
    this.shuffledList = this.getShuffledList();
  },
  mounted() {
    this.initAudio();
    this.setSelfAdaptingTheme();
    if (this.autoplay) this.play();
  },
  beforeDestroy() {
    if (activeMutex === this) {
      activeMutex = null;
    }
    if (this.hls) {
      this.hls.destroy();
    }
  }
};

export default VueAPlayer;
</script>

<style lang="scss">
@import "./scss/variables.scss";

.aplayer {
  background: rgb(37, 37, 37);
  display: flex;
  .img-box {
    position: relative;
    z-index: 101;
    display: flex;
    width: 60px;
    height: 60px;
    justify-content: center;
    align-items: center;
    background: rgb(37, 37, 37);
    .blur-box {
      overflow: hidden;
      img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 4px;
      }
    }
    &:hover {
      .open-pop {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url(~@/assets/images/open.png) no-repeat;
        background-size: 100% 100%;
        width: 30px;
        height: 30px;
        z-index: 1;
      }
      .retract-pop {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url(~@/assets/images/retract.png) no-repeat;
        background-size: 100% 100%;
        width: 30px;
        height: 30px;
        z-index: 1;
      }
      img {
        filter: blur(2px);
      }
    }
  }
  .lyrics-box {
    position: fixed;
    width: 100%;
    height: calc(100vh - 110px);
    background: #2d2d2d;
    top: 60px;
    transition: all 0.3s linear;
    z-index: 99;
    opacity: 0.99;
    display: flex;
    .lyrics-player {
      flex: 1;
      .pointer {
        position: absolute;
        top: 12px;
        left: 255px;
        transform-origin: left top;
        z-index: 1;
        img {
          width: 160px;
          height: 92;
        }
        .lyrics-raido {
          position: absolute;
          top: -12.5px;
          left: -12.5px;
          width: 25px;
          height: 25px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          &::after {
            content: "";
            width: 8px;
            height: 8px;
            background: rgb(223, 223, 223);
            border-radius: 50%;
          }
        }
      }
      .dish {
        position: absolute;
        top: 70px;
        left: 100px;
        background: url(~@/assets/images/dish.png) no-repeat;
        background-size: 100% 100%;
        width: 333px;
        height: 333px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          border-radius: 50%;
          width: 210px;
          height: 210px;
          animation: rotate 50s linear infinite;
          animation-play-state: paused;
          @keyframes rotate {
            100% {
              transform: rotate(360deg);
            }
          }
        }
      }
      .lyrics-btn-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        left: 128px;
        width: 283px;
        bottom: 100px;
        div {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgb(54, 54, 54);
        }
        .sc {
          background-image: url(~@/assets/images/sc.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 20px 20px;
        }
        .tj {
          background-image: url(~@/assets/images/tj.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 20px 20px;
        }
        .xz {
          background-image: url(~@/assets/images/xz.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 20px 20px;
        }
        .fx {
          background-image: url(~@/assets/images/fx.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 20px 20px;
        }
      }
    }
    .pointer-play {
      .pointer {
        animation: play 0.5s linear forwards;
        @keyframes play {
          100% {
            transform: rotate(32deg);
          }
        }
      }
      .dish {
        img {
          animation-play-state: running;
        }
      }
    }
    .pointer-end {
      .pointer {
        animation: play1 0.5s linear forwards;
        @keyframes play1 {
          0% {
            transform: rotate(32deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      }
    }
    .lyrics-info {
      &:before {
        position: absolute;
        top: 118px;
        z-index: 1;
        display: block;
        overflow: hidden;
        width: 100%;
        height: 5%;
        content: " ";
        pointer-events: none;
        background: -moz-linear-gradient(
          top,
          rgba(45, 45, 45, 1) 0%,
          rgba(45, 45, 45, 0) 100%
        );
        background: -webkit-linear-gradient(
          top,
          rgba(45, 45, 45, 1) 0%,
          rgba(45, 45, 45, 0) 100%
        );
        background: linear-gradient(
          to bottom,
          rgba(45, 45, 45, 1) 0%,
          rgba(45, 45, 45, 0) 100%
        );
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#00ffffff', GradientType=0);
      }
      &:after {
        position: absolute;
        bottom: 89px;
        z-index: 1;
        display: block;
        overflow: hidden;
        width: 100%;
        height: 5%;
        content: " ";
        pointer-events: none;
        background: -moz-linear-gradient(
          top,
          rgba(45, 45, 45, 0) 0%,
          rgba(45, 45, 45, 0.8) 100%
        );
        background: -webkit-linear-gradient(
          top,
          rgba(45, 45, 45, 0) 0%,
          rgba(45, 45, 45, 0.8) 100%
        );
        background: linear-gradient(
          to bottom,
          rgba(45, 45, 45, 0) 0%,
          rgba(45, 45, 45, 0.8) 100%
        );
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffffff', endColorstr='#ccffffff', GradientType=0);
      }
      flex: 1;
      .lyrics-wrapper {
        position: absolute;
        top: 120px;
        width: 377px;
        height: 350px;
        overflow-y: auto;
        .content {
          font-size: 14px;
          line-height: 40px;
          color: rgb(140, 140, 140);
          cursor: text;
          p {
            cursor: text;
            &:first-child {
              padding-top: 10px;
              margin-top: 0;
            }
            &:last-child {
              padding-bottom: 20px;
            }
            &::selection {
              background: rgb(37, 37, 37);
              background-size: 100% 100%;
              // color: rgb(136, 136, 136);
              // color: rgb(136, 136, 136);
            }
          }
        }
      }
    }
  }
  .lyrics-top {
    top: -560px;
  }
  .aplayer-lrc-content {
    display: none;
  }

  .aplayer-body {
    flex: 1;
    display: flex;
    background: #252525;
    position: relative;
    z-index: 101;
    .aplayer-info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      text-align: start;
      height: $aplayer-height;
      box-sizing: border-box;
      // overflow: hidden;

      .aplayer-music {
        cursor: default;
        margin: 6px 0 0 0px;
        .aplayer-title {
          color: rgb(190, 190, 190);
          font-size: 14px;
        }

        .aplayer-author {
          font-size: 12px;
          color: rgb(146, 146, 146);
        }
      }

      .aplayer-lrc {
        z-index: 0;
      }
    }
  }

  audio[controls] {
    display: block;
    width: 100%;
  }

  // Mini mode
  &.aplayer-narrow {
    width: $aplayer-height;
  }

  &.aplayer-withlrc {
    .aplayer-body {
      .aplayer-pic {
        height: $aplayer-height-lrc;
        width: $aplayer-height-lrc;
      }

      .aplayer-info {
        height: $aplayer-height-lrc;
      }

      .aplayer-info {
        padding: 10px 7px 0 7px;
      }
    }
  }

  &.aplayer-withlist {
    .aplayer-body {
      .aplayer-info {
        border-bottom: 1px solid #e9e9e9;
      }

      .aplayer-controller .aplayer-time .aplayer-icon.aplayer-icon-menu {
        display: block;
      }
    }
  }

  /* floating player on top */
  position: relative;
  &.aplayer-float {
    z-index: 1;
  }
}

@keyframes aplayer-roll {
  0% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
</style>