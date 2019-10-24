<template>
  <div id="music" @click="onClick" :class="{isPlay:isPlay}">
     <audio id="music-bgm" :src="src" :autoplay="autoplay" :loop="loop"></audio>
  </div>
</template>
<script>
import Weixin from "../utils/weixin.js";
export default {
  name: "Music",
  data() {
    return {
      autoplay: "autoplay",
      loop: "loop",
      isPlay: true, //IOS自动播放
      bgm: null
    };
  },
  props: ["src"],
  mounted() {
    this.bgm = document.getElementById("music-bgm");
    Weixin(
      {
        img_url: require("../assets/thumb.png"),
        link: "http://h5.bukeyi.net/h5/2019/hrdyr2/online",
        title: "华融湘江银行大额存单形象大使招募决赛",
        desc: "存款就选华融湘江银行大额存单"
      },
      () => {
        this.bgm.play();
      }
    );
  },
  methods: {
    onClick() {
      this.isPlay = !this.isPlay;
      this.isPlay ? this.bgm.play() : this.bgm.pause();
    }
  }
};
</script>

<style lang="less" scoped>
#music {
  position: fixed;
  right: 0.2rem;
  top: 0.45rem;
  z-index: 80;
  width: 0.48rem;
  height: 0.48rem;
  background-image: url(http://img.cntapp.com/h5/dragon/assets/music.png);
  background-size: 0.96rem 0.48rem;
  color: #fff;
}
#music.isPlay {
  background-position: right center;
}
</style>
