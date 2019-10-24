<template>
  <div class="home">
    <img src="../assets/logo.png" height="45" width="254" alt="" class="logo">
    <img @click='ruleShow=true' src="../assets/home_rule.png" height="39" width="138" alt="" class="rule_btn">
    <div class="t1 tc">
      <!-- <img src="../assets/home_t1.png" height="346" width="528" alt="" class="i1"> -->
      <img src="../assets/home_title.png" height="207" width="677" alt="" class="i2">
      <img src="../assets/home_content.png" alt="" class="i3">
    </div>
    <div class="upload tc">
      <!-- <img v-if="!has_uploaded" @click='onUpload' src="../assets/home_upload.png" height="104" width="615" alt=""> -->
      <img @click='gotoList'  src="../assets/uploaded.png" height="104" width="615" alt="">
    </div>
    <!-- rule -->
    <div class="rule alert" v-show='ruleShow'>
      <div class="main vtc bbox">
        <p class="text"><span class="head">活动时间：</span><br/>2019年10月8日-2019年10月31日</p>
        <p class="text"><span class="head">投票规则：</span><br/>每人每天可投1票 </p>
        <p class="text"><span class="head">活动规则： </span><br/>决赛选手共100名，最终决赛票数排名前6名的选手将成为本届的形象大使，并根据得票数排名赢取奖品</p>
        <p class="text">第1名：华为P30pro手机</p>
        <p class="text">第2-3名：华为P30手机</p>
        <p class="text">第4-6名：法国大使DELSEY双排轮拉杆箱</p>
        <p class="text"><span class="head">特别注意： </span><br/>本次活动最终解释权归华融湘江银行所有！</p>
        <img @click='ruleShow=false' src="../assets/close.png" height="52" width="52" alt="" class="close">
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api.js";
export default {
  data() {
    return {
      ruleShow: false,
      has_uploaded: false
    };
  },
  methods: {
    // async check_auth(){
    //   const res = await api.check_auth()
    //   if (res.error_no == 0) {
    //     this.has_uploaded = res.data.has_uploaded
    //     if (res.data.is_final) {
    //       this.has_uploaded = true
    //     }
    //   }
    // },
    gotoList() {
      this.$router.replace("/list");
    },
    onUpload() {
      this.$router.replace("/upload");
    }
  },
  async activated() {
    // this.check_auth()
    this.has_uploaded = window.is_final || window.has_uploaded;
  },
  computed: {},
  async mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.i3 {
  animation: zoomIn 0.5s 1.4s both;
}
.rule {
  .main {
    top: 45%;
    width: 6.68rem;
    border: 0.05rem solid #c9010b;
    border-radius: 0.15rem;
    background-color: #fff;
    padding: 0.73rem 0.53rem;
    .text {
      font-size: 0.24rem;
      line-height: 0.45rem;
    }
    .close {
      padding: 0.2rem;
      width: 0.52rem;
      height: 0.52rem;
      position: absolute;
      right: -0.4rem;
      top: -0.4rem;
    }
    .head {
      color: #c9010b;
      font-weight: bold;
    }
  }
}
.upload {
  animation: fadeInUp 1s both;
  width: 100%;
  img {
    width: 6.15rem;
    height: 1.04rem;
  }
}
.home {
  height: 16.45rem;
  width: 100%;
  background-image: url(../assets/home_bg.jpg);
  background-size: 7.5rem 16.45rem;
  background-repeat: no-repeat;
}
.logo {
  position: absolute;
  left: 0.3rem;
  top: 0.48rem;
  width: 2.54rem;
  height: 0.45rem;
  animation: fadeInDown 1s both;
}
.rule_btn {
  animation: fadeInDown 1s both;
  position: absolute;
  right: 0.85rem;
  top: 0.5rem;
  z-index: 1;
  width: 1.38rem;
  height: 0.39rem;
}
.t1 {
  padding-top: 1rem;
  position: relative;
  .i1 {
    animation: zoomIn 1s 0.5s both;
    width: 5.28rem;
    height: 3.46rem;
    position: absolute;
    left: 1rem;
    top: 1rem;
  }
  .i2 {
    animation: zoomIn 1s 0.8s both;
    padding-top: 0.6rem;
    width: 6.77rem;
    height: 2.07rem;
  }
  .i3 {
    width: 7.5rem;
    height: 7.84rem;
  }
}
</style>
