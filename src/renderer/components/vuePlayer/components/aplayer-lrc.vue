<template>
  <div class="lyrics-wrapper aplayer-lrc">
    <div class="content aplayer-lrc-contents" :style="transformStyle">
      <p
        v-for="(line, index) of lrcLines"
        :key="index"
        :class="{ 'aplayer-lrc-current': index === currentLineIndex }"
      >{{ line[1] }}</p>
    </div>
  </div>
</template>

<script>
import { parseLrc } from "../js/utils";
function getSelectedHtml(){
    var selectedHtml = "";
    var documentFragment = null;

    try{
        if(window.getSelection){
            documentFragment =  window.getSelection().getRangeAt(0).cloneContents();
        }else if(document.selection){
            documentFragment =  document.selection.createRange().HtmlText;
        }

        for(var i=0;i<documentFragment.childNodes.length;i++){
            var childNode = documentFragment.childNodes[i];
            if(childNode.nodeType==3){ // Text 节点
                selectedHtml+=childNode.nodeValue;
            }else{
                var nodeHtml = childNode.outerHTML;
                selectedHtml+=nodeHtml;
            }

        }

    }catch(err){

    }

    return selectedHtml;
}
export default {
  props: {
    currentMusic: {
      type: Object,
      required: true
    },
    playStat: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      displayLrc: "",
      currentLineIndex: 0,
      setTimeFn: null
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
          transform: `translateY(${-this.currentLineIndex * 20}px)`
        };
      } else {
        return {
          transform: `translateY(${-(
            140 +
            (this.currentLineIndex - 7) * 40
          )}px)`
        };
      }
    }
  },
  mounted() {
    document
      .querySelector(".aplayer-lrc")
      .addEventListener("scroll", this.debounce(this.turnBack, 1000));
    document.querySelector('.aplayer-lrc').addEventListener('mouseup',function(){
      console.log('getSelectedHtml',window.getSelection().getRangeAt(0));
    })
  },
  beforeDestroy() {
    document
      .querySelector(".aplayer-lrc")
      .removeEventListener("scroll", this.debounce(this.turnBack, 1000));
  },
  methods: {
    applyLrc(lrc) {
      if (/^https?:\/\//.test(lrc)) {
        this.fetchLrc(lrc);
      } else {
        this.displayLrc = lrc;
      }
    },
    fetchLrc(src) {
      fetch(src)
        .then(response => response.text())
        .then(lrc => {
          this.displayLrc = lrc;
        });
    },
    hideLrc() {
      this.displayLrc = "";
    },
    debounce(fn, wait) {
      var timer = null;
      return function() {
        var context = this;
        var args = arguments;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(function() {
          fn.apply(context, args);
        }, wait);
      };
    },
    turnBack(e) {
      this.setTimeFn = setTimeout(() => {
        e.target.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        this.setTimeFn = null;
      }, 5000);
    }
  },
  watch: {
    currentMusic: {
      immediate: true,
      handler(music) {
        this.currentLineIndex = 0;
        if (music.lrc) {
          this.applyLrc(music.lrc);
        } else {
          this.hideLrc();
        }
      }
    },
    "playStat.playedTime"(playedTime) {
      for (let i = 0; i < this.lrcLines.length; i++) {
        const line = this.lrcLines[i];
        const nextLine = this.lrcLines[i + 1];
        if (playedTime >= line[0] && (!nextLine || playedTime < nextLine[0])) {
          this.currentLineIndex = i;
        }
      }
    }
  }
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