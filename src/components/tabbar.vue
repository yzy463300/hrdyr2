<template>
  <div class="container" id="tabbar">
  	<div class="it" :class="[tabIndex == index ? 'active' : '']" v-for="(item,index) in tabList" @click="tabChange(index)">
  		<p class="icon tc"  :style="{backgroundImage: 'url(' + tabList[index].icon + ')'}"></p>
		<p class="label">{{item.label}}</p>
  	</div>
  </div>
</template>

<script>
import Weixin from "../utils/weixin.js";
export default {
  data() {
    return {
      tabIndex: 0,
      tabList: [
        {
          icon: require("../assets/home.png"),
          label: "首页"
        },
        {
          icon: require("../assets/rank.png"),
          label: "形象大使榜"
        },
        {
          icon: require("../assets/center.png"),
          label: "个人中心"
        }
      ]
    };
  },
  watch: {
    $route: function() {
      this.checkRouter();
    }
  },
  created() {
    console.log(this.$route.path);
    if (window.is_final) {
      this.tabList = [
        {
          icon: require("../assets/home.png"),
          label: "首页"
        },
        {
          icon: require("../assets/rank.png"),
          label: "形象大使榜"
        }
      ];
    } else {
      this.tabList = [
        {
          icon: require("../assets/home.png"),
          label: "首页"
        },
        {
          icon: require("../assets/rank.png"),
          label: "形象大使榜"
        },
        {
          icon: require("../assets/center.png"),
          label: "个人中心"
        }
      ];
    }
    this.checkRouter();
  },
  methods: {
    checkRouter() {
      const path = this.$route.path;
      if (path == "/") {
        this.tabIndex = 0;
        Weixin({
          img_url: require("../assets/thumb.png"),
          link: "http://h5.bukeyi.net/h5/2019/hrdyr2/online",
          title: "华融湘江银行大额存单形象大使招募决赛",
          desc: "存款就选华融湘江银行大额存单"
        });
      }
      if (path == "/list") {
        this.tabIndex = 1;
        Weixin({
          img_url: require("../assets/thumb.png"),
          link: "http://h5.bukeyi.net/h5/2019/hrdyr2/online",
          title: "华融湘江银行大额存单形象大使招募决赛",
          desc: "存款就选华融湘江银行大额存单"
        });
      }
      if (path == "/center") {
        this.tabIndex = 2;
      }
    },
    tabChange(index) {
      this.tabIndex = index;
      this.$emit("change", index);
    }
  }
};
</script>

<style  lang='less' scoped>
.it {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon {
    width: 0.4rem;
    height: 0.35rem;
    background-position: right top;
    background-size: 0.8rem 0.35rem;
  }

  .label {
    margin-top: 0.1rem;
    font-size: 0.24rem;
    color: #fff;
  }
}
.it.active {
  .icon {
    background-position: left top;
  }
  .label {
    color: #ffc15f;
  }
}
.container {
  background-color: #ab0006;
  position: fixed;
  z-index: 500;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.15rem;
  background-size: cover;
  display: flex;
  box-shadow: 0px 0px 0.1rem 0rem rgba(0, 0, 0, 0.7);
}
</style>
