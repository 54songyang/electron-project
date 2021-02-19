<template>
  <div
    class="aplayer"
    :class="{
      'aplayer-narrow': isMiniMode,
      'aplayer-withlist':
        !isMiniMode && Array.isArray(musicList) && musicList.length > 0,
      'aplayer-withlrc': !isMiniMode && (!!$slots.display || shouldShowLrc),
      'aplayer-float': isFloatMode,
      'aplayer-loading': isPlaying && isLoading,
    }"
    :style="floatStyleObj"
  >
    <div v-show="currentMusic" class="img-box" @click="$refs.lyrics.lyricsChannel()">
      <i :class="[showLrcPop ? 'retract-pop' : 'open-pop']"></i>
      <div class="blur-box">
        <img v-if="currentMusic" :src="currentMusic.al.picUrl" alt />
      </div>
    </div>
    <div class="aplayer-body">
      <div class="aplayer-info" v-show="!isMiniMode">
        <!-- shuffle：随机？
        theme:主题
        muted：静音
        toggleshuffle：切换随机
        setvolume：设置声音
        dragbegin：拖放开始
        dragend：拖放结束
        dragging：拖放中 -->
        <controls
          v-if="currentMusic"
          :shuffle="shouldShuffle"
          :stat="playStat"
          :muted="isAudioMuted"
          :dt="currentMusic.dt"
          @toggleshuffle="shouldShuffle = !shouldShuffle"
          @setvolume="setAudioVolume"
          @dragbegin="onProgressDragBegin"
          @dragend="onProgressDragEnd"
          @dragging="onProgressDragging"
        />
        <div class="aplayer-music" v-if="currentMusic">
          <span class="aplayer-title">{{
            currentMusic ? currentMusic.name : "Untitled"
          }}</span>
          <span class="aplayer-author hover-bright"
            >-{{
              currentMusic
                ? currentMusic.ar.map((el) => el.name).join("/")
                : "Unknown"
            }}</span
          >
        </div>
        <!-- <slot name="display" :current-music="currentMusic" :play-stat="playStat"> -->
        <!-- <lyrics :current-music="currentMusic" :play-stat="playStat" v-if="shouldShowLrc" /> -->
        <!-- </slot> -->
      </div>
      <thumbnail
        :playing="isPlaying"
        :enable-drag="isFloatMode"
        @toggleplay="toggle"
        @dragbegin="onDragBegin"
        @dragging="onDragAround"
      />
      <div class="controller-box">
        <div>
          <div class="play-btn play-tree"></div>
          <div :class="['play-btn', repeatType]" @click="setNextMode"></div>
          <div
            :class="['play-btn', !showMusicList ? 'play-lb' : 'play-lb-red']"
            @click="changeList"
          ></div>
          <div class="play-btn play-gc"></div>
          <volume
            v-if="!isMobile"
            :volume="internalVolume"
            :muted="isAudioMuted"
            @togglemute="toggleMute"
            @setvolume="(v) => setAudioVolume(v)"
          />
        </div>
      </div>
    </div>
    <audio ref="audio"></audio>
    <div :class="['lyrics-box', { 'lyrics-top': showLrcPop }]">
      <div
        :class="['lyrics-player', isPlaying ? 'pointer-play' : 'pointer-end']"
      >
        <div class="pointer">
          <i class="lyrics-raido"></i>
          <img src="@/assets/images/pointer.png" alt />
        </div>
        <div class="dish">
          <img v-if="currentMusic" :src="currentMusic.al.picUrl" />
        </div>
        <div class="lyrics-btn-box">
          <div class="sc"></div>
          <div class="tj"></div>
          <div class="xz"></div>
          <div class="fx"></div>
        </div>
      </div>
      <div class="lyrics-info">
        <div class="head-box" v-if="currentMusic">
          <div class="lyrics-name">{{ currentMusic.name }}</div>
          <div class="info-box">
            <div>
              专辑:<span>{{ currentMusic.al.name }}</span>
            </div>
            <div>
              歌手:<span>{{
                currentMusic.ar.map((el) => el.name).join("/")
              }}</span>
            </div>
            <div>
              来源:<span>{{
                currentMusic.ar.map((el) => el.name).join("/")
              }}</span>
            </div>
          </div>
        </div>
        <lyrics ref="lyrics" :play-stat="playStat" />
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
import Volume from "./components/aplayer-controller-volume";
import { deprecatedProp, versionCompare, warn } from "./js/utils";
import { mapActions, mapMutations } from "vuex";

let versionBadgePrinted = false;
const canUseSync = versionCompare(Vue.version, "2.3.0") >= 0;


// mutex playing instance
let activeMutex = null;

// const REPEAT = {
//   NONE: "none",
//   MUSIC: "music",
//   LIST: "list",
//   NO_REPEAT: "no-repeat",
//   REPEAT_ONE: "repeat-one",
//   REPEAT_ALL: "repeat-all",
//   REPEAT_RANDOM: "repeat-random",
// };

const VueAPlayer = {
  name: "APlayer",
  disableVersionBadge: false,
  components: {
    Thumbnail,
    Controls,
    MusicList,
    Lyrics,
    Volume,
  },
  props: {
    mini: {
      type: Boolean,
      default: false,
    },
    showLrc: {
      type: Boolean,
      default: false,
    },
    mutex: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: "#c3463a",
    },

    listMaxHeight: String,
    /**
     * @since 1.4.1
     * Fold playlist initially
     */
    listFolded: {
      type: Boolean,
      default: false,
    },

    /**
     * @since 1.2.0 Float mode
     */
    float: {
      type: Boolean,
      default: false,
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
      default: false,
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
      default: false,
    },

    /**
     * @since 1.4.0
     * observable, sync
     */
    muted: {
      type: Boolean,
      default: false,
    },
    /**
     * @since 1.4.0
     * observable
     */
    preload: String,


    // play order control
    // since 1.5.0

    /**
     * @since 1.5.0
     * @see https://support.apple.com/en-us/HT207230
     * twoWay
     */
    shuffle: {
      type: Boolean,
      default: false,
    },
    /**
     * @since 1.5.0
     * @see https://support.apple.com/en-us/HT207230
     * twoWay
     */
    // repeat: {
    //   type: String,
    //   default: REPEAT.NO_REPEAT,
    // },

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
      },
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
      },
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
      },
    },
  },
  data() {
    return {
      // internalMusic: this.music, //当前音乐？
      isSeeking: false, //是否在寻找？
      wasPlayingBeforeSeeking: false, //是否在寻找之前播放？
      isMobile: /mobile/i.test(window.navigator.userAgent),
      playStat: {
        duration: 0,
        loadedTime: 0,
        playedTime: 0,
      }, //播放统计
      showList: !this.listFolded, //显示播放列表

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

      // @since 1.4.1
      // Loading indicator
      isLoading: false, //歌曲缓冲中？

      // @since 1.5.1
      // sync shuffle, repeat
      internalShuffle: this.shuffle,
      internalRepeat: this.repeat,
      // for shuffling
    };
  },
  computed: {
    currentMusic() {
      return this.$store.state.music.currentMusic;
    },
    repeatType() {
      return this.$store.state.music.repeatType;
    },
    playOrder() {
      return this.$store.state.music.playOrder;
    },
    isPlaying() {
      //是否在播放
      return this.$store.state.music.isPlaying;
    },
    musicList() {
      //播放列表
      return this.$store.state.music.musicList;
    },
    showMusicList() {
      return this.$store.state.music.showMusicList;
    },
    showLrcPop() {
      return this.$store.state.music.showLrcPop;
    },
    // alias for $refs.audio
    audio() {
      return this.$refs.audio;
    },
    // compatible for deprecated props
    isMiniMode() {
      // 迷你模式
      return this.mini || this.narrow;
    },
    shouldShowLrc() {
      return this.showLrc || this.showlrc;
    },

    // props wrappers

    isFloatMode() {
      return this.float && !this.isMobile;
    },
    shouldAutoplay() {
      //可以自动播放（非移动端可以）
      if (this.isMobile) return false;
      return this.autoplay;
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
        webkitTransform: `translate(${this.floatOffsetLeft}px, ${this.floatOffsetTop}px)`,
      };
    },
    currentPicStyleObj() {
      if (this.currentMusic && this.currentMusic.pic) {
        return {
          backgroundImage: `url(${this.currentMusic.pic})`,
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

    // since 1.4.0
    // sync muted, volume

    isAudioMuted: {
      //静音
      get() {
        return this.internalMuted;
      },
      set(val) {
        canUseSync && this.$emit("update:muted", val);
        this.internalMuted = val;
      },
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
      },
    },
    // repeatMode: {
    //   //播放模式
    //   get() {
    //     switch (this.internalRepeat) {
    //       case REPEAT.NONE:
    //       case REPEAT.NO_REPEAT:
    //         return REPEAT.NO_REPEAT;
    //       case REPEAT.REPEAT_RANDOM:
    //         return REPEAT.REPEAT_RANDOM;
    //       case REPEAT.MUSIC:
    //       case REPEAT.REPEAT_ONE:
    //         return REPEAT.REPEAT_ONE;
    //       default:
    //         return REPEAT.REPEAT_ALL;
    //     }
    //   },
    //   set(val) {
    //     canUseSync && this.$emit("update:repeat", val);
    //     this.internalRepeat = val;
    //   },
    // },
    currentIndex() {
      return this.$store.getters.currentIndex;
    },
    internalVolume() {
      return this.$store.getters.internalVolume;
    },
  },
  methods: {
    ...mapActions(["getMusicData", "canUse", "musicUrl", "musicLrc","setRepeatType"]),
    // Float mode
    ...mapMutations(["SET_SHOWMUSICLIST", "SET_MUSICLIST", "SET_PLAYING","SET_VOLUUME"]),
    onDragBegin() {
      this.floatOriginX = this.floatOffsetLeft;
      this.floatOriginY = this.floatOffsetTop;
    },
    onDragAround({ offsetLeft, offsetTop }) {
      this.floatOffsetLeft = this.floatOriginX + offsetLeft;
      this.floatOffsetTop = this.floatOriginY + offsetTop;
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
    // functions
    selectRandom(max) {
      let arr = [];
      for (let i = 0; i < max; i++) {
        let arrNum = parseInt(Math.random() * max);
        let flag = true;
        for (let j = 0; j <= arr.length; j++) {
          if (arrNum == arr[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          arr.push(arrNum);
        } else {
          i--;
        }
      }
      return arr;
    },
    setNextMode() {
      //设置播放模式
      this.setRepeatType();
    },
    thenPlay() {
      //异步开始播放
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
      //***播放
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
            .then((res) => {
              this.rejectPlayPromise = null;
              resolve(res);
            })
            .catch(warn);
        }));
      }
    },
    pause() {
      //***暂停
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

    // event handlers
    // for keeping up with audio states

    onAudioPlay() {
      this.SET_PLAYING(true);
    },
    onAudioPause() {
      this.SET_PLAYING(false);
    },
    onAudioWaiting() {
      this.SET_PLAYING(true);
    },
    onAudioError(e) {
      const error = e.target.error;
      let msg = "";
      switch (error.code) {
        case 1:
          msg = "取回过程被用户中止。";
          break;
        case 2:
          msg = "当下载时发生错误。";
          break;
        case 3:
          msg = "当解码时发生错误。";
          break;
        case 4:
          msg = "媒体不可用或者不支持音频/视频。";
          break;
      }
      this.$toast(msg);
      setTimeout(() => {
        if (this.currentIndex < this.musicList.length - 1) {
          let index = this.currentIndex + 1;
          if (typeof index === "string") return;
          const currentMusic = { ...this.musicList[index] };
          this.SET_MUSICLIST({ currentMusic });
        }else{
          this.SET_MUSICLIST({ currentMusic:null });
        }
      }, 1000);
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
      this.SET_VOLUUME(this.audio.volume)
      this.isAudioMuted = this.audio.muted;
    },
    /**
     * 播放顺序
     */
    onAudioEnded() {
      // determine next song according to shuffle and repeat
      //播放完成
      if (this.repeatType === "no-repeat") {
        //无循环（顺序播放）
        if (this.currentIndex === this.musicList.length - 1) {
          //播放到最后一首
          this.pause()
        } else {
          let index = this.currentIndex + 1;
          const currentMusic = { ...this.musicList[index] };
          this.SET_MUSICLIST({ currentMusic });
        }
      } else if (this.repeatType === "repeat-one") {
        //单曲循环
        this.thenPlay();
      } else if (this.repeatType === "repeat-all") {
        //列表循环
        let index = "";
        if (this.currentIndex === this.musicList.length - 1) {
          index = 0;
        } else {
          index = this.currentIndex + 1;
        }
        if (typeof index === "string") return;
        const currentMusic = { ...this.musicList[index] };
        this.SET_MUSICLIST({ currentMusic });
      } else if (this.repeatType === "repeat-random") {
        //随机播放
        const list = this.playOrder;
        const index = list.indexOf(this.currentIndex);
        let num = 0;
        if (index !== list.length - 1) {
          num = index + 1;
        }
        const currentMusic = { ...this.musicList[list[num]] };
        this.SET_MUSICLIST({ currentMusic });
      }
      //todo 判断元素不在可视区域再滚动
      //todo const dom = document.querySelector(`.music-list${index}`);
      //todo if (dom) dom.scrollIntoView();
    },
    async initAudio() {
      // since 1.4.0 Audio attributes as props

      this.audio.controls = this.shouldShowNativeControls;
      this.audio.muted = this.muted;
      this.audio.preload = this.preload;
      this.audio.volume = this.internalVolume;

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
        "waiting",
      ];
      mediaEvents.forEach((event) => {
        this.audio.addEventListener(event, (e) => this.$emit(event, e));
      });

      // event handlers
      // they don't emit native media events

      this.audio.addEventListener("play", this.onAudioPlay);
      this.audio.addEventListener("pause", this.onAudioPause);
      this.audio.addEventListener("abort", this.onAudioPause);
      this.audio.addEventListener("waiting", this.onAudioWaiting);
      this.audio.addEventListener("error", this.onAudioError);
      this.audio.addEventListener("canplay", this.onAudioCanplay);
      this.audio.addEventListener("progress", this.onAudioProgress);
      this.audio.addEventListener("durationchange", this.onAudioDurationChange);
      this.audio.addEventListener("seeking", this.onAudioSeeking);
      this.audio.addEventListener("seeked", this.onAudioSeeked);
      this.audio.addEventListener("timeupdate", this.onAudioTimeUpdate);
      this.audio.addEventListener("volumechange", this.onAudioVolumeChange);
      this.audio.addEventListener("ended", this.onAudioEnded);

      if (this.currentMusic) {
        this.audio.src = this.currentMusic.url;
      }
    },

    changeList() {
      this.SET_SHOWMUSICLIST(!this.showMusicList);
      //todo 判断元素不在可视区域再滚动
      const dom = document.querySelector(`.music-list${this.currentIndex}`);
      if (dom) dom.scrollIntoView();
    },
  },
  watch: {
    currentMusic: {
      async handler(newVal, oldVal) {
        // async
        if (!newVal || (oldVal && newVal.id === oldVal.id)) return;
        let src = this.currentMusic.url;
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
        this.thenPlay();
        // self-adapting theme color
      },
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

    // sync muted, volume

    muted(val) {
      this.internalMuted = val;
    },

    // sync shuffle, repeat
    shuffle(val) {
      this.internalShuffle = val;
    },
    // repeat(val) {
    //   this.internalRepeat = val;
    // },
  },
  beforeCreate() {
    if (!VueAPlayer.disableVersionBadge && !versionBadgePrinted) {
      versionBadgePrinted = true;
    }
  },
  mounted() {
    //初始化并播放
    this.initAudio();
    if (this.autoplay) this.play();
  },
  beforeDestroy() {
    if (activeMutex === this) {
      activeMutex = null;
    }
    if (this.hls) {
      this.hls.destroy();
    }
  },
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
    min-width: 60px;
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
      .head-box {
        margin-top: 29px;
        .lyrics-name {
          font-size: 22px;
          color: rgb(213, 213, 213);
        }
        .info-box {
          display: flex;
          font-size: 13px;
          justify-content: space-between;
          margin-top: 12px;
          margin-right: 130px;
          max-width: 31.7vw;
          & > div {
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
          span {
            color: rgb(141, 180, 221);
          }
        }
      }
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
        border-right: 1px solid rgb(54, 54, 54);
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
    justify-content: space-between;
    cursor: default;
    .aplayer-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 39vw;
      padding-right: 5vw;
      text-align: start;
      height: $aplayer-height;
      box-sizing: border-box;
      // overflow: hidden;

      .aplayer-music {
        display: flex;
        cursor: default;
        margin: 6px 0 0 0px;
        .aplayer-title {
          display: block;
          color: rgb(190, 190, 190);
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          max-width: 50%;
        }

        .aplayer-author {
          display: block;
          font-size: 12px;
          color: rgb(146, 146, 146);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          max-width: 50%;
        }
      }

      .aplayer-lrc {
        z-index: 0;
      }
    }
    .controller-box {
      display: flex;
      justify-content: flex-end;
      flex: 1;
      & > div {
        height: 66px;
        display: flex;
        width: 180px;
        justify-content: space-around;
        align-items: center;
        margin-right: 14px;
      }
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
        height: 14px;
      }
      .repeat-one {
        background: url(~@/assets/images/dq.png) no-repeat;
        background-size: 100% 100%;
        height: 14px;
      }
      .repeat-random {
        background: url(~@/assets/images/suiji.png) no-repeat;
        background-size: 100% 100%;
        height: 14px;
      }
      .no-repeat {
        background: url(~@/assets/images/sx.png) center center no-repeat;
        background-size: 15px 12px;
      }
      .suiji {
        background: url(~@/assets/images/sj.png) no-repeat;
        background-size: 100% 100%;
      }
      .play-gc {
        background: url(~@/assets/images/gc.png) no-repeat;
        background-size: 100% 100%;
        width: 14px;
        height: 14px;
      }
      .play-tree {
        background: url(~@/assets/images/tree.png) no-repeat;
        background-size: 100% 100%;
      }
      .play-lb {
        background: url(~@/assets/images/lb.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
      }
      .play-lb-red {
        background: url(~@/assets/images/lb-red.png) no-repeat;
        background-size: 100% 100%;
        width: 20px;
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