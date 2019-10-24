<template>
  <div class="center" :class="{'active' : detail.name}">
    <div class="mask_wrap">
      <div class="work_wrap bbox" >
        <img :src="detail.img" alt="">
      </div>
      <div class="content">
        <div class="h1">
          <div class="name textoverflow">{{detail.name}}</div>
          <div class="bank tc textoverflow">{{detail.city_name}}</div>
          <div class="likes "><img src="../assets/thumb_lick.png"  alt=""> <span class="t textoverflow">{{detail.vote_count}}</span> </div>
        </div>
        <div class="h2">
          <div class="id">编号：{{detail.player_id}}</div>
          <div class="ranks"> <img src="../assets/rank_icon.png" alt=""> 排名：{{detail.rank}}</div>
        </div>
        <div class="tip tc" >距离上一名还差{{detail.need_votes}}票</div>
      </div>
      <!-- 他人页面 -->
      <div class="btn_wrap tc" v-if="!detail.is_self">
        <div class="vote"><img @click='vote' src="../assets/b2.png" height="85" width="347" alt=""></div>
        <div class="btn_bottom">
          <!-- <img @click='join' src="../assets/b10.png" class="doit"> -->
          <img @click='buyFormOnShow' src="../assets/b5.png" class="buy">
        </div>
      </div>
      <!-- 个人页面 -->
      <div class="btn_wrap tc" v-else>
        <div class="btn_bottom">
          <img @click='shareShow = true' src="../assets/b8.png" height="85" width="266" alt="" class="shareshow">
          <img @click='onSave' v-if="!detail.is_final" src="../assets/b9.png" height="85" width="266" alt="" class="save_btn">
        </div>
      </div>
      <img @click='onSave' v-if="!detail.is_final" src="../assets/b6.png" height="138" width="40" alt="" class="save">
      <!-- 广告 -->
      <p class="adv tc"><img src="../assets/adv.png" height="406" width="728" alt=""></p>
      <!-- share -->
      <div class="share alert" v-show='shareShow' @click='shareShow = false'>
        <img src="../assets/share.png" height="254" width="487" alt="">
      </div>
      
      <!-- imgshare -->
      <div class="share_img alert" v-show='createShow'>
        <div class="c vtc tc">
          <img :src="share_img" class="create">
          <p class="text">长按保存图片</p>
          <p class="return" @click='createShow = false'><img src="../assets/return_btn.png" height="70" width="260" alt=""></p>
        </div>
      </div>
      <!-- 投票成功 -->
      <div class="vote_success alert" v-show='voteSuccessShow'>
        <div class="main vtc tc">
          <p class="icon"><img src="../assets/success.png" height="133" width="133" alt=""></p>
          <p class="title">投票成功</p>
          <p class="join"><img @click='join' src="../assets/b3.png" height="84" width="283" alt=""></p>
          <p class="onbuy" @click='buyFormOnShow'><img src="../assets/b5.png" height="84" width="283" alt=""></p>
          <img @click='voteSuccessShow = false' src="../assets/close.png" height="52" width="52" alt="" class="close">
        </div>
      </div>
      <!-- 购买大额存单 -->
      <div class="buy_form alert" v-show='buyShow'>
        <div class="main vtc tc">
          <div class="title"><img src="../assets/t1.png" height="66" width="320" alt=""></div>
          <div class="name input_wrap bbox"><input v-model='name' type="text" placeholder="您的姓名"></div> 
          <div class="phone input_wrap bbox"><input v-model='phone' type="text" placeholder="您的电话"></div> 
          <div class="city input_wrap bbox" @click='cityShow = true'><input disabled="true" v-model='city' type="text" placeholder="所在城市"><img src="../assets/arr.png" height="18" width="24" alt=""></div> 
          <div class="bank input_wrap bbox" v-if="city_id" @click='bankShow = true'><input disabled="true" v-model='bank' type="text" placeholder="分行网点"><img src="../assets/arr.png" height="18" width="24" alt=""></div> 
          <div class="submit"><img @click='onSubmit' src="../assets/b7.png" height="90" width="340" alt=""></div>
          <img @click='buyShow = false' src="../assets/close.png" height="52" width="52" alt="" class="close">
        </div>
      </div>
      <van-popup v-model="cityShow" position='bottom'><van-picker  show-toolbar :columns="cityList" @cancel='cityShow = false' @confirm="cityConfirm" /></van-popup>
      <van-popup v-model="bankShow" position='bottom'><van-picker  show-toolbar :columns="bankList" @cancel='bankShow = false' @confirm="bankConfirm" /></van-popup>
    </div>
    <!-- html2canvas -->
    <div class="createimg" v-show='demoShow'>
      <div class="work_wrap bbox">
        <img :src="detail.img" alt="">
      </div>
      <div class="context">
        <div class="left">
          <div class="name_like">
            <div class="name">{{detail.name}}</div>
            <div class="like"><img src="../assets/thumb_lick.png" height="25" width="29" alt="">{{detail.vote_count}}</div>
          </div>
          <div class="address textoverflow">{{detail.city_name}}</div>
          <div class="tip"><img src="../assets/thumb_bot.png" height="47" width="280" alt=""></div>
        </div>
        <div class="right"><img :src="detail.qrcode" alt="" class="qrcode"></div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api.js";
import Weixin from "../utils/weixin.js";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      player_id: "",
      shareShow: false,
      qrcode: require("../assets/home_bg.jpg"),
      share_img: "",
      createShow: false,
      name: "",
      phone: "",
      city: "",
      city_id: "",
      bank: "",
      branch_id: "",
      demoShow: false,
      cityShow: false,
      bankShow: false,
      buyShow: false,
      voteSuccessShow: false,
      detail: {},
      cityList: [],
      bankList: []
    };
  },
  mounted() {},
  activated() {
    this.detail = {};
    this.player_id = this.$route.query.player_id;
    this.player_detail();
  },
  methods: {
    async player_detail() {
      const res = await api.player_detail({
        player_id: this.player_id
      });
      if (res.error_no == 0) {
        this.demoShow = true;
        this.detail = res.data;
        if (this.detail.is_self) {
          window.player_id = this.detail.player_id;
        }
        Weixin({
          img_url: require("../assets/thumb.png"),
          link: `http://h5.bukeyi.net/h5/2019/hrdyr2/online/?player_id=${this.detail.player_id}`,
          title: `"${this.detail.name}"参加了华融湘江银行大额存单形象大使招募决赛，快来为Ta投票吧`,
          desc: "存款就选华融湘江银行大额存单"
        });
      }
    },
    async city_list() {
      const res = await api.city_list();
      if (res.error_no == 0) {
        this.cityList = [];
        res.data.items.forEach((item, index) => {
          let obj = {};
          obj.text = item.city_name;
          obj.city_id = item.city_id;
          this.cityList.push(obj);
        });
      }
    },
    async branch_list() {
      const res = await api.branch_list({
        city_id: this.city_id
      });
      if (res.error_no == 0) {
        this.bankList = [];
        res.data.items.forEach((item, index) => {
          let obj = {};
          obj.text = item.branch_name;
          obj.branch_id = item.branch_id;
          this.bankList.push(obj);
        });
      }
    },
    async buyBigOrder() {
      const res = await api.buyBigOrder({
        name: this.name,
        phone: this.phone,
        branch_id: this.branch_id
      });
      if (res.error_no == 0) {
        this.buyShow = false;
        this.$dialog({
          message: "您的预约提交成功，我行客户经理将尽快与您联系！"
        });
      }
    },
    async vote() {
      const res = await api.vote({
        player_id: this.player_id
      });
      if (res.error_no == 0) {
        this.voteSuccessShow = true;
        this.player_detail();
      }
    },
    async join() {
      this.voteSuccessShow = false;
      if (window.has_uploaded) {
        this.player_id = window.player_id;
        this.player_detail();
        this.$router.push({
          path: "center",
          query: { player_id: window.player_id }
        });
      } else {
        this.$router.replace("upload");
      }
    },
    onSubmit() {
      if (!this.name) {
        this.$dialog({ message: "请填写姓名" });
        return;
      }
      if (!this.phone) {
        this.$dialog({ message: "请填写手机号" });
        return;
      }
      if (!this.city) {
        this.$dialog({ message: "请选择城市" });
        return;
      }
      if (!this.bank) {
        this.$dialog({ message: "请选择网店" });
        return;
      }
      this.buyBigOrder();
    },
    buyFormOnShow() {
      this.voteSuccessShow = false;
      this.buyShow = true;
      this.city_list();
    },
    cityConfirm(e) {
      this.city = e.text;
      this.city_id = e.city_id;
      this.cityShow = false;
      this.branch_list();
    },
    bankConfirm(e) {
      this.bank = e.text;
      this.branch_id = e.branch_id;
      this.bankShow = false;
    },
    onSave() {
      Toast.loading({
        message: "图片生成中...",
        loadingType: "spinner",
        duration: 0,
        forbidClick: true
      });
      html2canvas($(".createimg")[0], {
        backgroundColor: null,
        scale: 3,
        logging: true,
        useCORS: true
      }).then(canvas => {
        this.createShow = true;
        Toast.clear();
        let base64 = canvas.toDataURL();
        this.share_img = canvas.toDataURL();
      });
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.adv {
  padding-top: 0.5rem;
  img {
    width: 7.28rem;
    height: 4.06rem;
  }
}
.vote_success {
  .main {
    background-color: #fff;
    width: 6rem;
    border: 0.05rem solid #e61d39;
    padding: 0.5rem 0;
    border-radius: 0.1rem;
    .close {
      width: 0.52rem;
      height: 0.52rem;
      padding: 0.2rem;
      position: absolute;
      right: -0.4rem;
      top: -0.4rem;
    }
    .icon {
      img {
        width: 1.33rem;
        height: 1.33rem;
      }
    }
    .title {
      font-size: 0.36rem;
      padding: 0.2rem 0;
    }
    .join {
      img {
        width: 2.83rem;
        height: 0.84rem;
      }
    }
    .onbuy {
      margin-top: 0.2rem;
      img {
        width: 2.83rem;
        height: 0.84rem;
      }
    }
  }
}
.buy_form {
  .main {
    background-color: #fff;
    width: 6.37rem;
    border: 0.05rem solid #e61d39;
    padding: 0.5rem 0;
    border-radius: 0.1rem;
    .close {
      width: 0.52rem;
      height: 0.52rem;
      padding: 0.2rem;
      position: absolute;
      right: -0.4rem;
      top: -0.4rem;
    }
  }
  .submit {
    img {
      width: 3.4rem;
      height: 0.9rem;
    }
  }
  .title {
    img {
      width: 4.36rem;
      height: 0.66rem;
    }
  }
  .input_wrap {
    margin: 0.3rem auto;
    width: 4.68rem;
    height: 0.78rem;
    background-color: #fff;
    border: 0.02rem solid #c6c6c6;
    border-radius: 0.1rem;
    display: flex;
    padding-left: 0.2rem;
    display: flex;
    align-items: center;
    img {
      width: 0.24rem;
      height: 0.18rem;
    }
    input {
      background-color: #fff;
      width: 90%;
      border: none;
      font-size: 0.26rem;
    }
  }
}
.share_img {
  animation: fadeIn 0.5s both;
  .vtc {
    top: 45%;
  }
  .create {
    width: 4.79rem;
    height: 7.6rem;
  }
  .text {
    padding: 0.25rem 0;
    color: #fff;
    font-size: 0.3rem;
  }
  .return {
    img {
      width: 2.6rem;
      height: 0.7rem;
    }
  }
}
.createimg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -100;
  width: 7.5rem;
  height: 11.92rem;
  background-image: url(../assets/thumb_bg.jpg);
  background-size: 100% 100%;
  .context {
    position: relative;
    margin: 0 auto;
    margin-top: 1rem;
    width: 4.5rem;
    display: flex;
    padding-right: 0.3rem;
    justify-content: space-between;
    align-items: center;
    .left {
      margin-right: 0.3rem;
      font-size: 0.36rem;
      color: #fff;
      .address {
        padding: 0.05rem 0;
        font-size: 0.26rem;
      }
      .tip {
        padding-top: 0.1rem;
        img {
          width: 2.8rem;
          height: 0.47rem;
        }
      }
      .name_like {
        padding-top: 0.1rem;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .like {
          display: flex;
          align-items: baseline;
          img {
            margin-right: 0.05rem;
            width: 0.29rem;
            height: 0.25rem;
          }
        }
      }
    }
    .right {
      img {
        width: 1.29rem;
        height: 1.29rem;
      }
    }
  }
  .work_wrap {
    width: 4.63rem;
    height: 6.15rem;
    background-color: #fff;
    border-radius: 0.1rem;
    border: 0.16rem solid #fff;
    margin: 0 auto;
    margin-top: 2.8rem;
  }
}
.share {
  img {
    width: 4.87rem;
    height: 2.54rem;
    position: absolute;
    right: 0.7rem;
    top: 0.2rem;
    animation: fadeIn 0.5s linear alternate infinite;
  }
}
.save {
  padding-left: 0.3rem;
  width: 0.4rem;
  height: 1.38rem;
  position: fixed;
  right: 0;
  top: 4rem;
  z-index: 100;
}
.btn_wrap {
  .vote {
    img {
      width: 3.47rem;
      height: 0.85rem;
    }
  }
  .btn_bottom {
    margin-top: 0.2rem;
    .shareshow {
      margin: 0 0.05rem;
      width: 2.66rem;
      height: 0.85rem;
    }
    .save_btn {
      margin: 0 0.05rem;
      width: 2.66rem;
      height: 0.85rem;
    }
    .doit {
      margin: 0 0.05rem;
      width: 2.83rem;
      height: 0.84rem;
      margin-right: 0.1rem;
    }
    .buy {
      margin: 0 0.05rem;
      width: 3.47rem;
    }
  }
}
.content {
  width: 5rem;
  margin: 0.2rem auto;
  color: #fff;
  font-size: 0.32rem;
  .h1 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    .name {
      width: 33%;
    }
    .bank {
      width: 33%;
    }
    .likes {
      width: 33%;
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
      .t {
      }
      img {
        width: 0.29rem;
        margin-right: 0.1rem;
      }
    }
  }
  .h2 {
    padding: 0.15rem 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    .ranks {
      width: 50%;
      display: flex;
      align-items: baseline;
      justify-content: flex-end;
      img {
        margin-right: 0.1rem;
        height: 0.24rem;
      }
    }
  }
}
.work_wrap {
  width: 4.63rem;
  height: 6.15rem;
  background-color: #fff;
  border-radius: 0.1rem;
  border: 0.16rem solid #fff;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.center {
  opacity: 0;
  transition: all 0.5s;
}
.center.active {
  opacity: 1;
}
.mask_wrap {
  min-height: 11.5rem;
  padding-top: 3.09rem;
  padding-bottom: 0.5rem;
  background-image: url(../assets/form_bg.jpg);
  background-size: 7.5rem 16.53rem;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
  background-color: #c7000a;
}
</style>
